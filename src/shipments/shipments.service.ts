import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shipment, Order } from '../entities';
import { CreateShipmentDto, UpdateShipmentDto } from './dto/shipment.dto';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async create(createShipmentDto: CreateShipmentDto) {
    const { orderId, carrier, trackingNumber, status } = createShipmentDto;

    // Check if order exists
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Create shipment
    const shipment = this.shipmentRepository.create({
      orderId,
      carrier,
      trackingNumber,
      status,
      shippedAt: status === 'shipped' ? new Date() : null,
      deliveredAt: status === 'delivered' ? new Date() : null,
    });

    return await this.shipmentRepository.save(shipment);
  }

  async findAll() {
    return await this.shipmentRepository.find({
      relations: ['order'],
      order: { shippedAt: 'DESC' },
    });
  }

  async findByOrder(orderId: number) {
    return await this.shipmentRepository.find({
      where: { orderId },
      order: { shippedAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    return shipment;
  }

  async update(id: number, updateShipmentDto: UpdateShipmentDto) {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });
    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    // Update timestamps based on status changes
    const updateData = { ...updateShipmentDto } as any;
    
    if (updateShipmentDto.status === 'shipped' && shipment.status !== 'shipped') {
      updateData.shippedAt = new Date();
    }
    
    if (updateShipmentDto.status === 'delivered' && shipment.status !== 'delivered') {
      updateData.deliveredAt = new Date();
      if (!shipment.shippedAt) {
        updateData.shippedAt = new Date();
      }
    }

    await this.shipmentRepository.update(id, updateData);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const shipment = await this.shipmentRepository.findOne({ where: { id } });
    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }

    await this.shipmentRepository.remove(shipment);
    return { message: 'Shipment deleted successfully' };
  }

  async trackShipment(trackingNumber: string) {
    const shipment = await this.shipmentRepository.findOne({
      where: { trackingNumber },
      relations: ['order'],
    });

    if (!shipment) {
      throw new NotFoundException(`Shipment with tracking number ${trackingNumber} not found`);
    }

    return shipment;
  }
} 