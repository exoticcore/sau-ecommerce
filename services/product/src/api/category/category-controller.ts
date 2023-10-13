import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../error/bad-request';

export const getAllCategories = async (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json({ message: 'get all categories' });
};
