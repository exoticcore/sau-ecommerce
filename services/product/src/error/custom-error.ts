import { StatusCodes } from 'http-status-codes';

export class CustomAPIError extends Error {
  public status?: number;

  constructor(message?: string, status?: number) {
    super();
    this.message = message || 'internal server error';
    this.status = status || StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
