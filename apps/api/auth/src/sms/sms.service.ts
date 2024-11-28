import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  constructor(private configService: ConfigService) {}

  // This will be replaced with TOTP implementation
  async sendVerificationCode(phoneNumber: string): Promise<string> {
    const code = this.generateVerificationCode();
    console.log(`[DEBUG] Generated code: ${code}`);
    return code;
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
