import app from './app';
import prisma from './config/prisma';
import { redis } from './config/redis';
import rolesDefault from './config/roles-default';

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await redis.connect();
    console.log('connected to redis');
    await prisma.$connect();
    console.log('connected to database');
    await rolesDefault();
    console.log('created roles');
    await prisma.$disconnect();
    app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }
};

start();
