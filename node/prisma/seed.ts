import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { fake } from './fakedata';
const testDB = async () => {
  try {
    await prisma.testDB.deleteMany();
    console.log('Delete recoeds in testDB table');

    await prisma.testDB.createMany({
      data: fake,
    });
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
};

testDB();
