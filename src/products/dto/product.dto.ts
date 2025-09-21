import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 14 Pro' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Latest iPhone with advanced features' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 50.00, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: '["image1.jpg", "image2.jpg"]', required: false })
  @IsString()
  @IsOptional()
  images?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  images: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
} 