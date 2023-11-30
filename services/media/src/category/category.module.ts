import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { KafkaModule } from '../kafka/kafka.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, KafkaModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
