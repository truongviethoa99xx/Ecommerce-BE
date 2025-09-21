import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem, Product, Cart } from '../entities';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const { items, paymentMethod, shippingMethod, shippingAddress, status } =
      createOrderDto;

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}`,
        );
      }

      const itemTotal = (item.price - (item.discount || 0)) * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
      });
    }

    // Create order
    const order = this.orderRepository.create({
      userId,
      status,
      totalAmount,
      paymentMethod,
      shippingMethod,
      shippingAddress,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const orderItemsToSave = [];
    for (const item of orderItems) {
      const orderItem = this.orderItemRepository.create({
        ...item,
        orderId: savedOrder.id,
      });
      orderItemsToSave.push(orderItem);
    }

    await this.orderItemRepository.save(orderItemsToSave);

    // Update product stock
    for (const item of items) {
      await this.productRepository.decrement(
        { id: item.productId },
        'stock',
        item.quantity,
      );
    }

    // Clear user's cart (optional - you might want to keep it)
    await this.cartRepository.delete({ userId });

    return await this.findOne(savedOrder.id);
  }

  async createFromCart(
    userId: number,
    createOrderDto: Omit<CreateOrderDto, 'items'>,
  ) {
    // Get user's cart items
    const cartItems = await this.cartRepository.find({
      where: { userId },
      relations: ['product'],
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Convert cart items to order items
    const items = cartItems.map((cartItem) => ({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      price: cartItem.product.price,
      discount: cartItem.product.discount || 0,
    }));

    return await this.create(userId, { ...createOrderDto, items });
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
  }

  async findByUser(userId: number) {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    await this.orderRepository.update(id, updateOrderDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Remove order items first
    await this.orderItemRepository.remove(order.orderItems);

    // Remove order
    await this.orderRepository.remove(order);

    return { message: 'Order deleted successfully' };
  }
}
