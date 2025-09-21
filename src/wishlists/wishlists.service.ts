import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist, Product } from '../entities';
import { AddToWishlistDto } from './dto/wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async addToWishlist(userId: number, addToWishlistDto: AddToWishlistDto) {
    const { productId } = addToWishlistDto;

    // Check if product exists
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if product is already in wishlist
    const existingWishlistItem = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });

    if (existingWishlistItem) {
      throw new ConflictException('Product is already in your wishlist');
    }

    // Add to wishlist
    const wishlistItem = this.wishlistRepository.create({
      userId,
      productId,
    });

    return await this.wishlistRepository.save(wishlistItem);
  }

  async getWishlist(userId: number) {
    return await this.wishlistRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async removeFromWishlist(userId: number, wishlistItemId: number) {
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { id: wishlistItemId, userId },
    });

    if (!wishlistItem) {
      throw new NotFoundException(`Wishlist item with ID ${wishlistItemId} not found`);
    }

    await this.wishlistRepository.remove(wishlistItem);
    return { message: 'Item removed from wishlist successfully' };
  }

  async clearWishlist(userId: number) {
    await this.wishlistRepository.delete({ userId });
    return { message: 'Wishlist cleared successfully' };
  }

  async isInWishlist(userId: number, productId: number) {
    const wishlistItem = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });

    return { inWishlist: !!wishlistItem };
  }
} 