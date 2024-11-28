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
import { User } from '../users/types/user.types';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../email/email.service';
import { TwoFactorService } from '../services/two-factor.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly verificationService: VerificationService,
    private readonly emailService: EmailService,
    private readonly twoFactorService: TwoFactorService,
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
      if (!loginDto.twoFactorToken) {
        // Return a temporary token if 2FA token is not provided
        const tempToken = await this.jwtService.signAsync(
          {
            sub: user.id,
            email: user.email,
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

      // Verify 2FA token
      const isValid = await this.twoFactorService.verifyToken(
        user.id,
        loginDto.twoFactorToken,
      );

      if (!isValid) {
        throw new UnauthorizedException('Invalid 2FA token');
      }
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
