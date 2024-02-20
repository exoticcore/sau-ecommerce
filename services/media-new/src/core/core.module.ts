import { Global, Module } from '@nestjs/common';
import { AmqpService } from './provider/amqp/amqp.service';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { GRPCService } from './provider/grpc/grpc.service';

@Global()
@Module({
  providers: [AmqpService, HttpExceptionFilter, GRPCService],
  exports: [AmqpService, HttpExceptionFilter, GRPCService],
})
export class CoreModule {}
