import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, Product } from '../entities';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(userId: number, createReviewDto: CreateReviewDto) {
    const { productId, rating, comment } = createReviewDto;

    // Check if product exists
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if user already reviewed this product
    const existingReview = await this.reviewRepository.findOne({
      where: { userId, productId },
    });
    
    if (existingReview) {
      throw new ConflictException('You have already reviewed this product');
    }

    // Create review
    const review = this.reviewRepository.create({
      userId,
      productId,
      rating,
      comment,
    });

    return await this.reviewRepository.save(review);
  }

  async findAll() {
    return await this.reviewRepository.find({
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProduct(productId: number) {
    return await this.reviewRepository.find({
      where: { productId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number) {
    return await this.reviewRepository.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async update(id: number, userId: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewRepository.findOne({ 
      where: { id, userId } 
    });
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found or you don't have permission to update it`);
    }

    await this.reviewRepository.update(id, updateReviewDto);
    return await this.findOne(id);
  }

  async remove(id: number, userId: number) {
    const review = await this.reviewRepository.findOne({ 
      where: { id, userId } 
    });
    
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found or you don't have permission to delete it`);
    }

    await this.reviewRepository.remove(review);
    return { message: 'Review deleted successfully' };
  }
} 