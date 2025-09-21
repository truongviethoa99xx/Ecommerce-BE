import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateShipmentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  orderId: number;

  @ApiProperty({ example: 'DHL' })
  @IsString()
  @IsOptional()
  carrier?: string;

  @ApiProperty({ example: 'DHL123456789' })
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiProperty({ example: 'pending' })
  @IsString()
  status: string;
}

export class UpdateShipmentDto extends PartialType(CreateShipmentDto) {
  @ApiProperty({ example: 'delivered', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'DHL', required: false })
  @IsString()
  @IsOptional()
  carrier?: string;

  @ApiProperty({ example: 'DHL123456789', required: false })
  @IsString()
  @IsOptional()
  trackingNumber?: string;
}

export class ShipmentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  carrier: string;

  @ApiProperty()
  trackingNumber: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  shippedAt: Date;

  @ApiProperty()
  deliveredAt: Date;

  @ApiProperty()
  order: any;
} 