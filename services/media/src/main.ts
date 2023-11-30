import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AssignerProtocol, PartitionAssigner } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const partitioner: PartitionAssigner = ({ cluster }) => ({
    name: `MediaService`,
    version: 1,
    protocol({ topics }) {
      return {
        name: this.name,
        metadata: AssignerProtocol.MemberMetadata.encode({
          version: this.version,
          topics,
          userData: Buffer.from([]),
        }),
      };
    },
    assign: async ({ members }) => {
      await cluster.connect();
      await cluster.refreshMetadata();

      // const partitionMetadata = cluster.findTopicPartitionMetadata(topic);
      // const availablePartitions = partitionMetadata.map((pm) => pm.partitionId);

      return members.map((member) => ({
        memberId: member.memberId,
        memberAssignment: AssignerProtocol.MemberAssignment.encode({
          version: 1,
          assignment: {
            ['media.image.upload']: cluster
              .findTopicPartitionMetadata('media.image.upload')
              .map((pm) => pm.partitionId),
            ['media.image.update']: cluster
              .findTopicPartitionMetadata('media.image.update')
              .map((pm) => pm.partitionId),
            ['media.image.delete']: cluster
              .findTopicPartitionMetadata('media.image.delete')
              .map((pm) => pm.partitionId),
          },
          userData: Buffer.from([]),
        }),
      }));
    },
  });

  app.setGlobalPrefix('api/v1/media');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get('KAFKA_HOST')],
        // logLevel: 1,
      },
      consumer: {
        groupId: 'media-service-consumer',
        partitionAssigners: [partitioner],
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
