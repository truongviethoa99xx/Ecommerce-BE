import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '+84987654321', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '123 Main St, Ho Chi Minh City', required: false })
  @IsString()
  @IsOptional()
  address?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string;
}

export class AdminLoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'admin123' })
  @IsString()
  password: string;
}

export class AdminRegisterDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'Admin Name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

export class AuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: any;
} 

export class AdminStatusDto {
  @ApiProperty({ example: 'active', enum: ['active', 'inactive', 'blocked'] })
  @IsString()
  status: string;
}