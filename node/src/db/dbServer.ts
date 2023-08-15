// import { Client } from 'pg';
import { PrismaClient } from '@prisma/client';

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

db = global.__db;

export { db };

// const client = new Client({
//   host: process.env.PSQL_HOST,
//   port: 5432,
//   database: process.env.PSQL_DB,
//   user: process.env.PSQL_USER,
//   password: process.env.PSQL_PASS,
// });

// export const dbconnect = async (): Promise<void> => await client.connect();
