import { ApiProperty } from '@nestjs/swagger';

export class StatisticsResponseDto {
  @ApiProperty({ example: 150, description: 'Total number of users' })
  totalUsers: number;

  @ApiProperty({ example: 45, description: 'Total number of products' })
  totalProducts: number;

  @ApiProperty({ example: 89, description: 'Total number of orders' })
  totalOrders: number;

  @ApiProperty({ example: 12500.50, description: 'Total revenue amount' })
  totalRevenue: number;

  @ApiProperty({ example: 67, description: 'Total number of reviews' })
  totalReviews: number;

  @ApiProperty({ example: 12, description: 'Number of pending orders' })
  pendingOrders: number;

  @ApiProperty({ example: 3, description: 'Number of low stock products' })
  lowStockProducts: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Timestamp of statistics' })
  timestamp: Date;
}

export class SalesStatsDto {
  @ApiProperty({ example: 5, description: 'Orders placed today' })
  todayOrders: number;

  @ApiProperty({ example: 123, description: 'Orders placed this month' })
  monthlyOrders: number;

  @ApiProperty({ example: 2500.75, description: 'Revenue generated today' })
  todayRevenue: number;

  @ApiProperty({ example: 45000.25, description: 'Revenue generated this month' })
  monthlyRevenue: number;

  @ApiProperty({ 
    example: [
      { status: 'pending', count: '12' },
      { status: 'completed', count: '89' },
      { status: 'cancelled', count: '5' }
    ],
    description: 'Order status distribution'
  })
  orderStatusStats: any[];

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Timestamp of statistics' })
  timestamp: Date;
}

export class ProductStatsDto {
  @ApiProperty({ 
    example: [
      { productName: 'iPhone 14', productId: '1', totalSold: '25' },
      { productName: 'Samsung Galaxy', productId: '2', totalSold: '18' }
    ],
    description: 'Top selling products'
  })
  topSellingProducts: any[];

  @ApiProperty({ 
    example: [
      { categoryName: 'Electronics', count: '15' },
      { categoryName: 'Clothing', count: '8' }
    ],
    description: 'Products count by category'
  })
  productsByCategory: any[];

  @ApiProperty({ 
    example: [
      { id: 1, name: 'iPhone 14', stock: 2 },
      { id: 2, name: 'Samsung Galaxy', stock: 5 }
    ],
    description: 'Products with low stock'
  })
  lowStockProducts: any[];

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Timestamp of statistics' })
  timestamp: Date;
}

export class UserStatsDto {
  @ApiProperty({ example: 3, description: 'New users registered today' })
  newUsersToday: number;

  @ApiProperty({ example: 45, description: 'New users registered this month' })
  newUsersThisMonth: number;

  @ApiProperty({ example: 78, description: 'Active users in last 30 days' })
  activeUsers: number;

  @ApiProperty({ 
    example: [
      { date: '2024-01-10', count: '5' },
      { date: '2024-01-11', count: '3' },
      { date: '2024-01-12', count: '7' }
    ],
    description: 'User registration trend for last 7 days'
  })
  registrationTrend: any[];

  @ApiProperty({ example: '2024-01-15T10:30:00Z', description: 'Timestamp of statistics' })
  timestamp: Date;
}
