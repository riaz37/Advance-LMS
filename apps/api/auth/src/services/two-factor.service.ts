import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { DrizzleService } from '../drizzle/drizzle.service';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class TwoFactorService {
  constructor(private readonly drizzle: DrizzleService) {}

  /**
   * Generate a new secret for 2FA
   */
  async generateSecret(userId: string, email: string) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(email, 'Advanced LMS', secret);
    
    // Store the secret
    await this.drizzle.db
      .update(users)
      .set({ twoFactorSecret: secret })
      .where(eq(users.id, userId));

    // Generate QR code
    const qrCode = await QRCode.toDataURL(otpAuthUrl);
    
    return {
      secret,
      qrCode,
    };
  }

  /**
   * Verify a 2FA token
   */
  async verifyToken(userId: string, token: string): Promise<boolean> {
    const user = await this.drizzle.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user?.twoFactorSecret) {
      return false;
    }

    return authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    });
  }

  /**
   * Enable 2FA for a user
   */
  async enable2FA(userId: string): Promise<void> {
    await this.drizzle.db
      .update(users)
      .set({ is2FAEnabled: true })
      .where(eq(users.id, userId));
  }

  /**
   * Disable 2FA for a user
   */
  async disable2FA(userId: string): Promise<void> {
    await this.drizzle.db
      .update(users)
      .set({ 
        is2FAEnabled: false,
        twoFactorSecret: null,
      })
      .where(eq(users.id, userId));
  }
}
