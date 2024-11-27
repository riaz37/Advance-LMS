import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Inject } from '@nestjs/common';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
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
}
