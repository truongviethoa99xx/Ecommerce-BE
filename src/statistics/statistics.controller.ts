import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { StatisticsResponseDto } from './dto/statistics.dto';

@ApiTags('Statistics')
@Controller('statistics')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully', type: StatisticsResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getOverview() {
    return this.statisticsService.getOverviewStats();
  }

  @Get('sales')
  @ApiOperation({ summary: 'Get sales statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Sales statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getSalesStats() {
    return this.statisticsService.getSalesStats();
  }

  @Get('products')
  @ApiOperation({ summary: 'Get product statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getProductStats() {
    return this.statisticsService.getProductStats();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get user statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getUserStats() {
    return this.statisticsService.getUserStats();
  }
}
