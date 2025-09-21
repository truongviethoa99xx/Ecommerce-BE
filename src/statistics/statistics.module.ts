import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { User, Product, Order, Payment, Review } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Product, Order, Payment, Review])
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
