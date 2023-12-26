import { CustomAPIError } from './custom-api';

export class UnauthorizeError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.status = 401;
  }
}
