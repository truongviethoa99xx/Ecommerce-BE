import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Product } from '../entities';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find({
      relations: ['category'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.update(id, updateProductDto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }

  async findByCategory(categoryId: number) {
    return await this.productRepository.find({
      where: { categoryId },
      relations: ['category'],
    });
  }

  async findAllWithFilters(filters: {
    categoryId?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
  }) {
    const { categoryId, search, minPrice, maxPrice, page, limit, sortBy, sortOrder } = filters;

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .addSelect((subQuery) => {
        return subQuery
          .select('COALESCE(AVG(review.rating), 0)')
          .from('reviews', 'review')
          .where('review.product_id = product.id');
      }, 'averageRating');

    // Apply filters
    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Apply sorting
    const validSortFields = ['name', 'price', 'createdAt', 'stock'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`product.${sortField}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Get results with raw average rating and total count
    const countQuery = this.productRepository.createQueryBuilder('product');

    // Re-apply filters for count
    if (categoryId) {
      countQuery.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      countQuery.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (minPrice !== undefined) {
      countQuery.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      countQuery.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const [{ entities: products, raw }, total] = await Promise.all([
      queryBuilder.getRawAndEntities(),
      countQuery.getCount(),
    ]);

    const data = products.map((product, index) => ({
      ...product,
      rating: raw && raw[index] && raw[index].averageRating !== undefined ? parseFloat(raw[index].averageRating) : 0,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };
  }
}
