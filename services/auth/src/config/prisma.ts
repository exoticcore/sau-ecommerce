import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: <string>process.env.DATABASE_URL,
    },
  },
});

export default prisma;
