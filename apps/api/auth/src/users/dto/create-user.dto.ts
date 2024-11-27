import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'student', required: false })
  @IsString()
  role?: string = 'student';

  @ApiProperty({ required: false })
  @IsString()
  provider?: string;

  @ApiProperty({ required: false })
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  isEmailVerified?: string;
}
