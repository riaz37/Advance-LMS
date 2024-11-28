import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Inject } from '@nestjs/common';
import * as schema from '../db/schema';
import { eq, and, or, gt, lt } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';

@Injectable()
export class VerificationService {
  constructor(
    @Inject('DRIZZLE')
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async createEmailVerificationToken(userId: string): Promise<string> {
    // Generate a random token
    const token = randomBytes(32).toString('hex');
    
    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Delete any existing email verification tokens for this user
    await this.db
      .delete(schema.verificationTokens)
      .where(
        eq(schema.verificationTokens.userId, userId) && 
        eq(schema.verificationTokens.type, 'email')
      );

    // Create new verification token
    await this.db.insert(schema.verificationTokens).values({
      userId,
      token,
      type: 'email',
      expiresAt,
    });

    return token;
  }

  async verifyEmailToken(token: string): Promise<string | null> {
    const [verificationToken] = await this.db
      .select()
      .from(schema.verificationTokens)
      .where(
        eq(schema.verificationTokens.token, token) && 
        eq(schema.verificationTokens.type, 'email')
      );

    if (!verificationToken) {
      return null;
    }

    // Check if token is expired
    if (new Date() > verificationToken.expiresAt) {
      // Delete expired token
      await this.db
        .delete(schema.verificationTokens)
        .where(eq(schema.verificationTokens.id, verificationToken.id));
      return null;
    }

    // Delete the used token
    await this.db
      .delete(schema.verificationTokens)
      .where(eq(schema.verificationTokens.id, verificationToken.id));

    return verificationToken.userId;
  }

  async createVerificationCode(
    userId: string,
    code: string,
    type: 'SMS_2FA' | 'PHONE_VERIFICATION',
  ) {
    // Delete any existing unused codes for this user and type
    await this.db
      .delete(schema.verificationCodes)
      .where(
        and(
          eq(schema.verificationCodes.userId, userId),
          eq(schema.verificationCodes.type, type),
          eq(schema.verificationCodes.used, false),
        ),
      );

    // Create new verification code
    const [verificationCode] = await this.db
      .insert(schema.verificationCodes)
      .values({
        userId,
        code,
        type,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      })
      .returning();

    return verificationCode;
  }

  async verifyCode(userId: string, code: string, type: 'SMS_2FA' | 'PHONE_VERIFICATION') {
    const now = new Date();

    // Find valid verification code
    const [verificationCode] = await this.db
      .select()
      .from(schema.verificationCodes)
      .where(
        and(
          eq(schema.verificationCodes.userId, userId),
          eq(schema.verificationCodes.code, code),
          eq(schema.verificationCodes.type, type),
          eq(schema.verificationCodes.used, false),
          gt(schema.verificationCodes.expiresAt, now),
        ),
      );

    if (!verificationCode) {
      return false;
    }

    // Mark code as used
    await this.db
      .update(schema.verificationCodes)
      .set({ used: true })
      .where(eq(schema.verificationCodes.id, verificationCode.id));

    return true;
  }

  async cleanupExpiredCodes() {
    const now = new Date();
    await this.db
      .delete(schema.verificationCodes)
      .where(
        or(
          lt(schema.verificationCodes.expiresAt, now),
          eq(schema.verificationCodes.used, true),
        ),
      );
  }
}
