import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const checkUser = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: 'check user' });
};
