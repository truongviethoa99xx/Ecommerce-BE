import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ValidateNested, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 50.00, required: false })
  @IsNumber()
  discount?: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'pending' })
  @IsString()
  status: string;

  @ApiProperty({ example: 'credit_card' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ example: 'standard' })
  @IsString()
  shippingMethod: string;

  @ApiProperty({ example: '123 Main St, Ho Chi Minh City' })
  @IsString()
  shippingAddress: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({ example: 'shipped', required: false })
  @IsString()
  status?: string;
}

export class OrderResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  paymentMethod: string;

  @ApiProperty()
  shippingMethod: string;

  @ApiProperty()
  shippingAddress: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  orderItems: any[];
} 