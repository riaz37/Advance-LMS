import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { EmailModule } from '../email/email.module';
import { VerificationModule } from '../verification/verification.module';
import { SmsModule } from '../sms/sms.module';
import { TwoFactorService } from '../services/two-factor.service';
import { TwoFactorController } from '../controllers/two-factor.controller';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    VerificationModule,
    EmailModule,
    SmsModule,
  ],
  controllers: [AuthController, TwoFactorController],
  providers: [AuthService, JwtStrategy, TwoFactorService],
  exports: [AuthService],
})
export class AuthModule {}
