import { Controller, Post, Body, UseGuards, Req, HttpCode } from '@nestjs/common';
import { TwoFactorService } from '../services/two-factor.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('2FA')
@Controller('2fa')
@UseGuards(JwtAuthGuard)
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate 2FA secret and QR code' })
  @ApiResponse({ status: 200, description: 'Returns secret and QR code' })
  async generate(@Req() req: any) {
    const { sub: userId, email } = req.user;
    return this.twoFactorService.generateSecret(userId, email);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify 2FA token and enable 2FA' })
  @ApiResponse({ status: 200, description: '2FA enabled successfully' })
  async verify(@Req() req: any, @Body('token') token: string) {
    const { sub: userId } = req.user;
    const isValid = await this.twoFactorService.verifyToken(userId, token);
    
    if (isValid) {
      await this.twoFactorService.enable2FA(userId);
      return { message: '2FA enabled successfully' };
    }
    
    return { message: 'Invalid token' };
  }

  @Post('disable')
  @ApiOperation({ summary: 'Disable 2FA' })
  @ApiResponse({ status: 200, description: '2FA disabled successfully' })
  async disable(@Req() req: any) {
    const { sub: userId } = req.user;
    await this.twoFactorService.disable2FA(userId);
    return { message: '2FA disabled successfully' };
  }
}
