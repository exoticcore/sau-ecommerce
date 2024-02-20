import { OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

export class GRPCService implements OnModuleInit {
  async onModuleInit() {}
}
