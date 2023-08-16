import { PrismaClient } from '@prisma/client';
import fs from 'fs';
// import { Client } from 'pg';

const sql = fs
  .readFileSync('./migration.sql', 'utf8')
  .toString()
  .split('\n')
  .filter((line) => line.indexOf('--') !== 0)
  .join('\n')
  .replace(/(\r\n|\n|\r)/gm, ' ') // remove newlines
  .replace(/\s+/g, ' ') // excess white space
  .split(';');

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

db = global.__db;

export { db };

export const checkDB = async () => {
  await db.$connect();
  const count = `SELECT COUNT(*) FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema' AND tablename != '_prisma_migrations'`;
  const databases: [{ count: any }] = await db.$queryRawUnsafe(count);
  databases.forEach((count) => {
    count.count = Number(count.count);
  });
  // console.log(databases[0].count);
  if (databases[0].count < 1) {
    for (const sqls of sql) {
      try {
        await db.$queryRawUnsafe(sqls);
      } catch (err) {
        console.log(err);
      }
    }
  }
};

// const client = new Client({
//   host: process.env.PSQL_HOST,
//   port: 5432,
//   database: process.env.PSQL_DB,
//   user: process.env.PSQL_USER,
//   password: process.env.PSQL_PASS,
// });

// export const db = async (): Promise<void> => {
//   await client.connect();
// };

// export const checkDB = async () => {
//   await client.connect();
//   const query = `SELECT * FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema' AND tablename != '_prisma_migrations'`;
//   const databases = await client.query(query);
//   if (!databases.rowCount)
//     await client
//       .query(sql)
//       .catch((err) => console.log(err))
//       .finally(() => console.log('databases created.'));
// };
