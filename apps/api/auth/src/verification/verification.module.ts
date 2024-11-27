import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
