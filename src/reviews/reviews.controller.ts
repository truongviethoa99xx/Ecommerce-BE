import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, ReviewResponseDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Already reviewed this product' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@GetUser() user: any, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(user.id, createReviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiQuery({ name: 'productId', required: false, description: 'Filter by product ID' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully', type: [ReviewResponseDto] })
  findAll(@Query('productId') productId?: string) {
    if (productId) {
      return this.reviewsService.findByProduct(parseInt(productId));
    }
    return this.reviewsService.findAll();
  }

  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user reviews' })
  @ApiResponse({ status: 200, description: 'User reviews retrieved successfully', type: [ReviewResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMyReviews(@GetUser() user: any) {
    return this.reviewsService.findByUser(user.id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 404, description: 'Review not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiOperation({ summary: 'Update your own review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 404, description: 'Review not found or no permission' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id', ParseIntPipe) id: number, @GetUser() user: any, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, user.id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiOperation({ summary: 'Delete your own review' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found or no permission' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: any) {
    return this.reviewsService.remove(id, user.id);
  }
} 