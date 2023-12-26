import express, { NextFunction } from 'express';

const notFound = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  return res.status(404).json({ message: 'route not found.' });
};
