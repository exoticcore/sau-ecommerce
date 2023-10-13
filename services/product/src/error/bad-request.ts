import { StatusCodes } from 'http-status-codes';
import { CustomAPIError } from './custom-error';

export class BadRequestError extends CustomAPIError {
  constructor(message: string) {
    super();
    this.message = message;
    this.status = StatusCodes.BAD_REQUEST;
  }
}