import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { AddToWishlistDto, WishlistResponseDto } from './dto/wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Wishlists')
@Controller('wishlists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  @ApiOperation({ summary: 'Add item to wishlist' })
  @ApiResponse({ status: 201, description: 'Item added to wishlist successfully', type: WishlistResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'Product already in wishlist' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addToWishlist(@GetUser() user: any, @Body() addToWishlistDto: AddToWishlistDto) {
    return this.wishlistsService.addToWishlist(user.id, addToWishlistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist retrieved successfully', type: [WishlistResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getWishlist(@GetUser() user: any) {
    return this.wishlistsService.getWishlist(user.id);
  }

  @Get('check/:productId')
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiOperation({ summary: 'Check if product is in wishlist' })
  @ApiResponse({ status: 200, description: 'Check result returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  isInWishlist(@GetUser() user: any, @Param('productId', ParseIntPipe) productId: number) {
    return this.wishlistsService.isInWishlist(user.id, productId);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Wishlist item ID' })
  @ApiOperation({ summary: 'Remove item from wishlist' })
  @ApiResponse({ status: 200, description: 'Item removed from wishlist successfully' })
  @ApiResponse({ status: 404, description: 'Wishlist item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeFromWishlist(@GetUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.wishlistsService.removeFromWishlist(user.id, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  clearWishlist(@GetUser() user: any) {
    return this.wishlistsService.clearWishlist(user.id);
  }
} 