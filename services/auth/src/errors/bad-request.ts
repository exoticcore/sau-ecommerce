import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './custom-api';

export default class BadRequest extends CustomAPIError {
  public statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
