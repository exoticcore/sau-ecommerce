import { Response } from 'express';

export const internalServer = (res: Response) => {
  return res.status(500).json({ message: 'internal server error' });
};
