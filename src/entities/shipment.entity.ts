import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'order_id' })
  orderId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  carrier: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'tracking_number' })
  trackingNumber: string;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'timestamp', name: 'shipped_at', nullable: true })
  shippedAt: Date;

  @Column({ type: 'timestamp', name: 'delivered_at', nullable: true })
  deliveredAt: Date;

  @ManyToOne(() => Order, order => order.shipments)
  @JoinColumn({ name: 'order_id' })
  order: Order;
} 