import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto, CartResponseDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully', type: CartResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addToCart(@GetUser() user: any, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(user.id, addToCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully', type: [CartResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCart(@GetUser() user: any) {
    return this.cartService.getCart(user.id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully', type: CartResponseDto })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateCartItem(
    @GetUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.updateCartItem(user.id, id, updateCartDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  removeFromCart(@GetUser() user: any, @Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeFromCart(user.id, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  clearCart(@GetUser() user: any) {
    return this.cartService.clearCart(user.id);
  }
} 