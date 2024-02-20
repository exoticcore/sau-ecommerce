import { OnModuleInit } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

export class AmqpService implements OnModuleInit {
  public channelWrapper: ChannelWrapper;

  constructor() {
    const connection = amqp.connect(['amqp://localhost']);
    this.channelWrapper = connection.createChannel();
  }

  async onModuleInit() {
    await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
      await channel.assertExchange('media_exchange', 'direct', {
        durable: true,
      });
      await channel.assertQueue('media_queue', { durable: true });
      await channel.assertQueue('product_queue', { durable: true });
      await channel.bindQueue(
        'media_queue',
        'media_exchange',
        'media.product.delete',
      );
      await channel.bindQueue(
        'product_queue',
        'media_exchange',
        'product.media.brand.delete',
      );
      await channel.bindQueue(
        'product_queue',
        'media_exchange',
        'product.media.brand.create',
      );
    });
  }
}
