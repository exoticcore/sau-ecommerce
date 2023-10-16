import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import { BadRequestError } from '../error';

export default (model: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const isValidated = model.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!isValidated) throw new BadRequestError('Unvalidate data');

    return next();
  };
};
