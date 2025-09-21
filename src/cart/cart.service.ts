import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, Product } from '../entities';
import { AddToCartDto, UpdateCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Check if product exists
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if item already exists in cart
    const existingCartItem = await this.cartRepository.findOne({
      where: { userId, productId },
    });

    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity += quantity;
      return await this.cartRepository.save(existingCartItem);
    }

    // Create new cart item
    const cartItem = this.cartRepository.create({
      userId,
      productId,
      quantity,
    });

    return await this.cartRepository.save(cartItem);
  }

  async getCart(userId: number) {
    return await this.cartRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async updateCartItem(userId: number, cartItemId: number, updateCartDto: UpdateCartDto) {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartItemId, userId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    cartItem.quantity = updateCartDto.quantity;
    return await this.cartRepository.save(cartItem);
  }

  async removeFromCart(userId: number, cartItemId: number) {
    const cartItem = await this.cartRepository.findOne({
      where: { id: cartItemId, userId },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${cartItemId} not found`);
    }

    await this.cartRepository.remove(cartItem);
    return { message: 'Item removed from cart successfully' };
  }

  async clearCart(userId: number) {
    await this.cartRepository.delete({ userId });
    return { message: 'Cart cleared successfully' };
  }
} 