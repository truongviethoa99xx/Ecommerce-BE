import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  orderId: number;

  @ApiProperty({ example: 999.99 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'credit_card' })
  @IsString()
  method: string;

  @ApiProperty({ example: 'completed' })
  @IsString()
  status: string;
}

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiProperty({ example: 'failed', required: false })
  @IsString()
  status?: string;
}

export class PaymentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orderId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  method: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  paidAt: Date;

  @ApiProperty()
  order: any;
}
