import { StatusCodes } from 'http-status-codes';

export default class CustomAPIError extends Error {
  constructor(message: string) {
    super(message);
  }
}
