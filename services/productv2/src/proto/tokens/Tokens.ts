// Original file: proto/token.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type { AccessToken as _tokens_AccessToken, AccessToken__Output as _tokens_AccessToken__Output } from '../tokens/AccessToken';
import type { TokenInfo as _tokens_TokenInfo, TokenInfo__Output as _tokens_TokenInfo__Output } from '../tokens/TokenInfo';

export interface TokensClient extends grpc.Client {
  verify(
    argument: _tokens_AccessToken,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_tokens_TokenInfo__Output>,
  ): grpc.ClientUnaryCall;
  verify(argument: _tokens_AccessToken, metadata: grpc.Metadata, callback: grpc.requestCallback<_tokens_TokenInfo__Output>): grpc.ClientUnaryCall;
  verify(argument: _tokens_AccessToken, options: grpc.CallOptions, callback: grpc.requestCallback<_tokens_TokenInfo__Output>): grpc.ClientUnaryCall;
  verify(argument: _tokens_AccessToken, callback: grpc.requestCallback<_tokens_TokenInfo__Output>): grpc.ClientUnaryCall;
  verify(
    argument: _tokens_AccessToken,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_tokens_TokenInfo__Output>,
  ): grpc.ClientUnaryCall;
  verify(argument: _tokens_AccessToken, metadata: grpc.Metadata, callback: grpc.requestCallback<_tokens_TokenInfo__Output>): grpc.ClientUnaryCall;
  verify(argument: _tokens_AccessToken, options: grpc.CallOptions, callback: grpc.requestCallback<_tokens_TokenInfo__Output>): grpc.ClientUnaryCall;
  verify(argument: _tokens_AccessToken, callback: grpc.requestCallback<_tokens_TokenInfo__Output>): grpc.ClientUnaryCall;
}

export interface TokensHandlers extends grpc.UntypedServiceImplementation {
  verify: grpc.handleUnaryCall<_tokens_AccessToken__Output, _tokens_TokenInfo>;
}

export interface TokensDefinition extends grpc.ServiceDefinition {
  verify: MethodDefinition<_tokens_AccessToken, _tokens_TokenInfo, _tokens_AccessToken__Output, _tokens_TokenInfo__Output>;
}
