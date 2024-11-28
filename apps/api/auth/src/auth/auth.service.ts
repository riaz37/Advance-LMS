import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Enable2FADto } from './dto/enable-2fa.dto';
import { Verify2FADto } from './dto/verify-2fa.dto';
import { User } from '../users/types/user.types';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../email/email.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly verificationService: VerificationService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.is2FAEnabled) {
      if (!user.phoneNumber) {
        throw new UnauthorizedException('Phone number not set for 2FA');
      }

      const code = this.smsService.generateVerificationCode();
      await this.verificationService.createVerificationCode(user.id, code, 'SMS_2FA');
      await this.smsService.send2FACode(user.phoneNumber, code);

      const tempToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          requires2FA: true,
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '5m',
        },
      );

      return {
        requires2FA: true,
        tempToken,
      };
    }

    const tokens = await this.generateTokens(user);
    return {
      user,
      ...tokens,
    };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      emailVerified: false,
      role: 'STUDENT'
    });

    // Generate verification token and send email
    const verificationToken = await this.verificationService.createEmailVerificationToken(user.id);
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    const tokens = await this.generateTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const user = await this.usersService.findOne(decoded.sub);
      const tokens = await this.generateTokens(user);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyEmail(token: string) {
    const userId = await this.verificationService.verifyEmailToken(token);
    if (!userId) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    const user = await this.usersService.verifyEmail(userId);
    const tokens = await this.generateTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  async requestPasswordReset(dto: RequestPasswordResetDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return { message: 'If your email exists in our system, you will receive a password reset link.' };
    }

    const token = await this.verificationService.createEmailVerificationToken(user.id);
    await this.emailService.sendPasswordResetEmail(user.email, token);

    return { message: 'If your email exists in our system, you will receive a password reset link.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const userId = await this.verificationService.verifyEmailToken(dto.token);
    if (!userId) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    const user = await this.usersService.updatePassword(userId, hashedPassword);
    const tokens = await this.generateTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  async enable2FA(userId: string, dto: Enable2FADto) {
    // Check if email is verified
    const user = await this.usersService.findOne(userId);
    if (!user.emailVerified) {
      throw new BadRequestException('Please verify your email before enabling 2FA');
    }

    const code = this.smsService.generateVerificationCode();
    await this.verificationService.createVerificationCode(userId, code, 'PHONE_VERIFICATION');
    await this.smsService.send2FACode(dto.phoneNumber, code);

    await this.usersService.update(userId, {
      phoneNumber: dto.phoneNumber,
    });

    return { message: 'Verification code sent to your phone' };
  }

  async verifyPhone(userId: string, code: string) {
    const isCodeValid = await this.verificationService.verifyCode(
      userId,
      code,
      'PHONE_VERIFICATION',
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid verification code');
    }

    await this.usersService.update(userId, {
      phoneVerified: true,
      is2FAEnabled: true,
    });

    return { message: '2FA enabled successfully' };
  }

  async verify2FA(dto: Verify2FADto) {
    try {
      const payload = await this.jwtService.verifyAsync(dto.tempToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (!payload.requires2FA) {
        throw new UnauthorizedException('Invalid token');
      }

      const isCodeValid = await this.verificationService.verifyCode(
        payload.sub,
        dto.code,
        'SMS_2FA',
      );

      if (!isCodeValid) {
        throw new UnauthorizedException('Invalid verification code');
      }

      const user = await this.usersService.findOne(payload.sub);
      const tokens = await this.generateTokens(user);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token or code');
    }
  }

  async disable2FA(userId: string) {
    await this.usersService.update(userId, {
      is2FAEnabled: false,
    });

    return { message: '2FA disabled successfully' };
  }

  private async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateOAuthUser(email: string, firstName: string, lastName: string, provider: string) {
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.create({
        email,
        firstName,
        lastName,
        provider,
        emailVerified: true,
        password: await bcrypt.hash(Math.random().toString(36), 10),
      });
    }

    return user;
  }
}
