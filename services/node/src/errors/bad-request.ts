import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api';

export default class BadRequestError extends CustomAPIError {
  public statusCode;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
