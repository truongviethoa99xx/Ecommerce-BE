import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, Order } from '../entities';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(userId: number, createPaymentDto: CreatePaymentDto) {
    const { orderId, amount, method, status } = createPaymentDto;

    // Check if order exists and belongs to user
    const order = await this.orderRepository.findOne({ 
      where: { id: orderId, userId } 
    });
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found or doesn't belong to you`);
    }

    // Create payment
    const payment = this.paymentRepository.create({
      orderId,
      userId,
      amount,
      method,
      status,
      paidAt: status === 'completed' ? new Date() : null,
    });

    return await this.paymentRepository.save(payment);
  }

  async findAll() {
    return await this.paymentRepository.find({
      relations: ['order', 'user'],
      order: { paidAt: 'DESC' },
    });
  }

  async findByUser(userId: number) {
    return await this.paymentRepository.find({
      where: { userId },
      relations: ['order'],
      order: { paidAt: 'DESC' },
    });
  }

  async findByOrder(orderId: number) {
    return await this.paymentRepository.find({
      where: { orderId },
      relations: ['user'],
      order: { paidAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['order', 'user'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Update paidAt if status changes to completed
    if (updatePaymentDto.status === 'completed' && payment.status !== 'completed') {
      updatePaymentDto = { ...updatePaymentDto, paidAt: new Date() } as any;
    }

    await this.paymentRepository.update(id, updatePaymentDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    await this.paymentRepository.remove(payment);
    return { message: 'Payment deleted successfully' };
  }
} 