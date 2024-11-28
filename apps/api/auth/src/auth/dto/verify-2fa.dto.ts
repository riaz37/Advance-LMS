import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Verify2FADto {
  @ApiProperty({
    example: '123456',
    description: '6-digit verification code',
  })
  @IsString()
  @Length(6, 6)
  code: string;

  @ApiProperty({
    example: 'temporary-token',
    description: 'Temporary token received after initial login',
  })
  @IsString()
  tempToken: string;
}
