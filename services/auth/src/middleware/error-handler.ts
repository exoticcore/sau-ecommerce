import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { CustomAPIError } from '../error/index';

const errorHandler: ErrorRequestHandler = (
  err: CustomAPIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customError = {
    statusCode: err.status || 500,
    msg: err.message || 'Internal server error.',
  };
  return res.status(customError.statusCode).json({ message: customError.msg });
};

export default errorHandler;
