import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the person contacting' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+84987654321', description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Product Inquiry', description: 'Subject of the message' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'I would like to know more about your products...', description: 'Message content' })
  @IsString()
  message: string;

  @ApiProperty({ example: 'inquiry', description: 'Type of contact', enum: ['inquiry', 'support', 'complaint', 'feedback'], required: false })
  @IsOptional()
  @IsEnum(['inquiry', 'support', 'complaint', 'feedback'])
  type?: string;

  @ApiProperty({ example: 1, description: 'User ID if user is logged in', required: false })
  @IsOptional()
  @IsNumber()
  userId?: number;
}

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @ApiProperty({ example: 'pending', description: 'Status of the contact message', enum: ['pending', 'in_progress', 'resolved', 'closed'], required: false })
  @IsOptional()
  @IsEnum(['pending', 'in_progress', 'resolved', 'closed'])
  status?: string;

  @ApiProperty({ example: 'Thank you for your inquiry. We will get back to you soon.', description: 'Admin response to the contact', required: false })
  @IsOptional()
  @IsString()
  response?: string;
}

export class ContactResponseDto {
  @ApiProperty({ example: 1, description: 'Contact ID' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the person contacting' })
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({ example: '+84987654321', description: 'Phone number' })
  phone?: string;

  @ApiProperty({ example: 'Product Inquiry', description: 'Subject of the message' })
  subject: string;

  @ApiProperty({ example: 'I would like to know more about your products...', description: 'Message content' })
  message: string;

  @ApiProperty({ example: 'inquiry', description: 'Type of contact' })
  type?: string;

  @ApiProperty({ example: 'pending', description: 'Status of the contact message' })
  status: string;

  @ApiProperty({ example: 'Thank you for your inquiry. We will get back to you soon.', description: 'Admin response to the contact' })
  response?: string;

  @ApiProperty({ example: 1, description: 'User ID if user is logged in' })
  userId?: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'When the contact was submitted' })
  submittedAt: Date;

  @ApiProperty({ example: '2024-01-15T14:30:00Z', description: 'When the contact was last updated' })
  updatedAt?: Date;
}
