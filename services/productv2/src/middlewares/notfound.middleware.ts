import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';

const NotFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
  throw new HttpException(404, 'Route not found');
};

export default NotFoundMiddleware;
