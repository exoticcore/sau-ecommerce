import { db } from '../db/dbServer';
import { Role, $Enums } from '@prisma/client';

interface User {
  user_id: number;
  email: string;
  password: string;
  role: $Enums.Role;
  verificationToken: string | null;
  isVerified: boolean;
  passwordToken: string | null;
  passwordTokenExpDate: Date | null;
  saltAuth: string;
  createAt: Date;
  updateAt: Date | null;
}

export const checkEmail = async (email: string): Promise<User | null> => {
  return db.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const countUser = async (): Promise<number> => {
  return db.user.count();
};

export const registerUser = async (user: User) => {
  return db.user.create({
    data: {
      ...user,
      updateAt: new Date(),
    },
    select: {
      user_id: true,
      email: true,
      role: true,
      image: true,
      verificationToken: true,
      saltAuth: true,
    },
  });
};
