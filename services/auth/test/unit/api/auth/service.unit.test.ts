import { describe, test, it, expect, jest } from '@jest/globals';
import AuthService from '../../../src/api/auth/auth-service';
import prisma from '../../../src/config/prisma';
import { User } from '@prisma/client';

const authService = new AuthService();

describe('Auth Service Unit Testing', () => {
  const userMockData: User = {
    id: 'some thing',
    email: 'test@test.com',
    password: 'secret',
  };

  describe('check email', () => {
    it('should return false', async () => {
      const prismaMock = jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue(null);

      const email = 'test@test.com';
      const isEmail = await authService.checkEmail(email);

      expect(isEmail).toEqual(isEmail);
      expect(prismaMock).toBeCalledTimes(1);
    });

    it('should return true', async () => {
      const prismaMock = jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue(userMockData);

      const isEmail = await authService.checkEmail('admin@admin.com');

      expect(isEmail).toEqual(isEmail);
      expect(prismaMock).toBeCalledTimes(1);
    });

    it('should throw error', async () => {
      const prismaMock = jest
        .spyOn(prisma.user, 'findUnique')
        .mockImplementation(() => {
          throw new Error();
        });

      await expect(
        authService.checkEmail('somemail@mail.com')
      ).rejects.toThrowError();
      expect(prismaMock).toBeCalled();
    });
  });

  describe('get user by email', () => {
    const userEmail = 'test@test.com';
    it('should return user info', async () => {
      const prismaMock = jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue(userMockData);

      const user = await authService.getUserByEmail(userEmail);

      expect(user).toEqual(userMockData);
      expect(prismaMock).toBeCalledTimes(1);
    });

    it('should return null', async () => {
      const prismaMock = jest
        .spyOn(prisma.user, 'findUnique')
        .mockResolvedValue(null);

      const user = await authService.getUserByEmail(userEmail);

      expect(user).toBeNull();
      expect(prismaMock).toBeCalledTimes(1);
    });

    it('should throw error', async () => {
      const prismaMock = jest
        .spyOn(prisma.user, 'findUnique')
        .mockImplementation(() => {
          throw new Error('eiei');
        });

      await expect(
        authService.getUserByEmail(userMockData.email)
      ).rejects.toThrowError();
      expect(prismaMock).toBeCalledTimes(1);
    });
  });

  describe('verify email', () => {
    it.todo('verify in email service');
  });
});
