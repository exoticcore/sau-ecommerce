import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from './prisma/prisma.module';
import { KafkaModule } from './kafka/kafka.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    KafkaModule,
    CategoryModule,
  ],
})
export class AppModule {}
