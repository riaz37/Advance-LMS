import { Controller, Post, Body, UseGuards, Req, HttpCode } from '@nestjs/common';
import { TwoFactorService } from '../services/two-factor.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('2FA')
@Controller('2fa')
@UseGuards(JwtAuthGuard)
export class TwoFactorController {
  constructor(private readonly twoFactorService: TwoFactorService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate 2FA secret and QR code' })
  @ApiResponse({ status: 200, description: 'Returns the secret and QR code' })
  async generate(@Req() req: any) {
    const { id, email } = req.user;
    return this.twoFactorService.generateSecret(id, email);
  }

  @Post('verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify 2FA token' })
  @ApiResponse({ status: 200, description: 'Returns true if token is valid' })
  async verify(@Req() req: any, @Body() body: { token: string }) {
    const { id } = req.user;
    return this.twoFactorService.verifyToken(id, body.token);
  }

  @Post('enable')
  @HttpCode(200)
  @ApiOperation({ summary: 'Enable 2FA' })
  @ApiResponse({ status: 200, description: '2FA enabled successfully' })
  async enable(@Req() req: any) {
    const { id } = req.user;
    await this.twoFactorService.enable2FA(id);
    return { message: '2FA enabled successfully' };
  }

  @Post('disable')
  @HttpCode(200)
  @ApiOperation({ summary: 'Disable 2FA' })
  @ApiResponse({ status: 200, description: '2FA disabled successfully' })
  async disable(@Req() req: any) {
    const { id } = req.user;
    await this.twoFactorService.disable2FA(id);
    return { message: '2FA disabled successfully' };
  }
}
