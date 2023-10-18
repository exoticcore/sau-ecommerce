import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AssignerProtocol } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

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
      },
      consumer: {
        groupId: 'media-consumer',
        partitionAssigners: [
          ({ cluster }) => ({
            name: 'AllPartitionAssigner',
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

              return members.map((member) => ({
                memberId: member.memberId,
                memberAssignment: AssignerProtocol.MemberAssignment.encode({
                  version: 1,
                  assignment: { ['media.upload.image.category']: [0] },
                  userData: Buffer.from([]),
                }),
              }));
            },
          }),
        ],
      },
    },
  });

  app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
