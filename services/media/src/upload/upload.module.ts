import { Global, Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from '../kafka/kafka.module';

@Global()
@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
    ClientsModule.register([
      {
        name: 'MEDIA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: '',
            brokers: [],
          },
          consumer: {
            groupId: 'upload-consumer',
          },
          producerOnlyMode: true,
        },
      },
    ]),
    KafkaModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
