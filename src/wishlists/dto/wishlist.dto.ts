import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddToWishlistDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  productId: number;
}

export class WishlistResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  product: any;
} 