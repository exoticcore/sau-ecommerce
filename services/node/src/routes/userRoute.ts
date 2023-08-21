import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default (router: express.Router) => {
  router.get(
    '/user/all',
    async (req: express.Request, res: express.Response) => {
      const user = await prisma.testDB.findMany({});
      res.status(200).json({ user });
    }
  );
};
