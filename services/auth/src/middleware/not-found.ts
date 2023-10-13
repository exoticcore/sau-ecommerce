import { Request, Response } from 'express';
import { StatusCodes } from '../../node_modules/http-status-codes/build/cjs/status-codes.js';

const notFound = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Route not found 😵' });
};

export default notFound;
