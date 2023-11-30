import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from './prisma/prisma.module';
import { KafkaModule } from './kafka/kafka.module';
import { CategoryModule } from './category/category.module';
import { S3Module } from './s3/s3.module';
import { AuthModule } from './auth/auth.module';
import { BrandModule } from './brand/brand.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    KafkaModule,
    S3Module,
    CategoryModule,
    AuthModule,
    BrandModule,
    ImageModule,
  ],
})
export class AppModule {}
