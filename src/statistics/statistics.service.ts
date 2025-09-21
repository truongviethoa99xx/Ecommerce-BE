import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Product, Order, Payment, Review } from '../entities';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async getOverviewStats() {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      totalReviews,
      pendingOrders,
      lowStockProducts,
    ] = await Promise.all([
      this.userRepository.count(),
      this.productRepository.count(),
      this.orderRepository.count(),
      this.getTotalRevenue(),
      this.reviewRepository.count(),
      this.orderRepository.count({ where: { status: 'pending' } }),
      this.productRepository.count({ where: { stock: 10 } }), // Products with stock <= 10
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      totalReviews,
      pendingOrders,
      lowStockProducts,
      timestamp: new Date(),
    };
  }

  async getSalesStats() {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    const [todayOrders, monthlyOrders, todayRevenue, monthlyRevenue] = await Promise.all([
      this.getOrdersCountByDate(today),
      this.getOrdersCountByDateRange(lastMonth, today),
      this.getRevenueByDate(today),
      this.getRevenueByDateRange(lastMonth, today),
    ]);

    // Get order status distribution
    const orderStatusStats = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('order.status')
      .getRawMany();

    return {
      todayOrders,
      monthlyOrders,
      todayRevenue,
      monthlyRevenue,
      orderStatusStats,
      timestamp: new Date(),
    };
  }

  async getProductStats() {
    // Top selling products
    const topSellingProducts = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.orderItems', 'orderItem')
      .leftJoin('orderItem.product', 'product')
      .select('product.name', 'productName')
      .addSelect('product.id', 'productId')
      .addSelect('SUM(orderItem.quantity)', 'totalSold')
      .groupBy('product.id, product.name')
      .orderBy('SUM(orderItem.quantity)', 'DESC')
      .limit(10)
      .getRawMany();

    // Products by category
    const productsByCategory = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('COUNT(*)', 'count')
      .groupBy('category.name')
      .getRawMany();

    // Low stock products
    const lowStockProducts = await this.productRepository.find({
      where: { stock: 10 }, // Products with stock <= 10
      select: ['id', 'name', 'stock'],
      order: { stock: 'ASC' },
      take: 20,
    });

    return {
      topSellingProducts,
      productsByCategory,
      lowStockProducts,
      timestamp: new Date(),
    };
  }

  async getUserStats() {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);

    const [newUsersToday, newUsersThisMonth, activeUsers] = await Promise.all([
      this.getUsersCountByDate(today),
      this.getUsersCountByDateRange(lastMonth, today),
      this.getActiveUsersCount(),
    ]);

    // User registration trend (last 7 days)
    const registrationTrend = await this.getUserRegistrationTrend();

    return {
      newUsersToday,
      newUsersThisMonth,
      activeUsers,
      registrationTrend,
      timestamp: new Date(),
    };
  }

  private async getTotalRevenue(): Promise<number> {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: 'completed' })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  private async getOrdersCountByDate(date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.orderRepository
      .createQueryBuilder('order')
      .where('order.createdAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .getCount();
  }

  private async getOrdersCountByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.orderRepository
      .createQueryBuilder('order')
      .where('order.createdAt BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .getCount();
  }

  private async getRevenueByDate(date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: 'completed' })
      .andWhere('payment.paidAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  private async getRevenueByDateRange(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.status = :status', { status: 'completed' })
      .andWhere('payment.paidAt BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  private async getUsersCountByDate(date: Date): Promise<number> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .getCount();
  }

  private async getUsersCountByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .getCount();
  }

  private async getActiveUsersCount(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.orderRepository
      .createQueryBuilder('order')
      .select('DISTINCT order.userId')
      .where('order.createdAt >= :date', { date: thirtyDaysAgo })
      .getCount();
  }

  private async getUserRegistrationTrend(): Promise<any[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.userRepository
      .createQueryBuilder('user')
      .select('DATE(user.createdAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('user.createdAt >= :date', { date: sevenDaysAgo })
      .groupBy('DATE(user.createdAt)')
      .orderBy('DATE(user.createdAt)', 'ASC')
      .getRawMany();
  }
}
