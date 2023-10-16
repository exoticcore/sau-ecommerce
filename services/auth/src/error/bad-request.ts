import { StatusCodes } from '../../node_modules/http-status-codes/build/cjs/status-codes.js';
import { CustomAPIError } from './custom-api.js';

export class BadRequestError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.status = StatusCodes.BAD_REQUEST;
  }
}
