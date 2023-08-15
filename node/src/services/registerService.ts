import { db } from '../db/dbServer';

export const createUser = async (name: string, email: string) => {
  return db.testDB.create({
    data: {
      name: name,
      email: email,
      updateAt: new Date(),
    },
    select: {
      test_id: true,
      name: true,
      email: true,
      createAt: true,
      updateAt: true,
    },
  });
};
