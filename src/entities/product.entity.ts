import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { OrderItem } from './order-item.entity';
import { Review } from './review.entity';
import { Wishlist } from './wishlist.entity';
import { Cart } from './cart.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  discount: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'int', name: 'category_id', nullable: true })
  categoryId: number;

  @Column({ type: 'text', nullable: true })
  images: string; // JSON array as text

  @Column({ type: 'int', name: 'no_of_sell', default: 0 })
  noOfSell: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @OneToMany(() => Wishlist, wishlist => wishlist.product)
  wishlists: Wishlist[];

  @OneToMany(() => Cart, cart => cart.product)
  carts: Cart[];
} 