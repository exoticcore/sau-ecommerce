import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { TokensClient as _tokens_TokensClient, TokensDefinition as _tokens_TokensDefinition } from './tokens/Tokens';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  tokens: {
    AccessToken: MessageTypeDefinition
    TokenInfo: MessageTypeDefinition
    Tokens: SubtypeConstructor<typeof grpc.Client, _tokens_TokensClient> & { service: _tokens_TokensDefinition }
  }
}

