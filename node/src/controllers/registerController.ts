import express, { Request, Response } from 'express';
import { createUser } from '../services/registerService';

export const register = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  const newUser = await createUser(name, email);

  return res.status(200).json(newUser);
};
