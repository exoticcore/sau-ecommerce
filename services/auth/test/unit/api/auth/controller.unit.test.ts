import { describe, it, test, expect, jest, beforeEach } from '@jest/globals';
import httpMocks from 'node-mocks-http';

import AuthController from '../../../src/api/auth/auth-controller';
import AuthService from '../../../src/api/auth/auth-service';

import argon2 from 'argon2';

describe('Auth Controller Unit Testing', () => {
  describe('check email', () => {
    let authController: AuthController;
    let req = httpMocks.createRequest();
    let res = httpMocks.createResponse();

    beforeEach(() => {
      authController = new AuthController();
      req = httpMocks.createRequest({
        body: { email: 'test2@test.com' },
      });
      res = httpMocks.createResponse();
    });

    it('should return 200 with message true', async () => {
      const checkEmailMock = jest
        .spyOn(AuthService.prototype, 'checkEmail')
        .mockImplementation(async () => {
          return req.body.email;
        });

      await authController.checkEmail(req, res);

      expect(checkEmailMock).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toEqual(200);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res._getJSONData().message).toEqual(true);
      expect(res._getJSONData().email).toEqual(req.body.email);
    });

    it('should return 201 message false', async () => {
      const checkEmailMock = jest
        .spyOn(AuthService.prototype, 'checkEmail')
        .mockImplementation(async () => {
          return null;
        });

      await authController.checkEmail(req, res);

      expect(checkEmailMock).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toEqual(201);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res._getJSONData().message).toEqual(false);
      expect(res._getJSONData().email).toEqual(req.body.email);
      expect(res._getJSONData().countDown).toEqual(1000 * 60 * 30);
    });

    it('should return 500 message internal server error', async () => {
      const checkEmailMock = jest
        .spyOn(AuthService.prototype, 'checkEmail')
        .mockImplementation(async () => {
          throw new Error('this is error');
        });

      await authController.checkEmail(req, res);

      expect(checkEmailMock).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toEqual(500);
      expect(res._isEndCalled()).toBeTruthy();
      expect(res._getJSONData().message).toEqual('internal server error');
    });
  });

  describe('login', () => {
    let authController: AuthController;
    let req = httpMocks.createRequest();
    let res = httpMocks.createResponse();

    beforeEach(() => {
      authController = new AuthController();
      req = httpMocks.createRequest({
        body: {
          email: 'test@test.com',
          password: 'secret',
        },
        session: {
          refresh_token: jest.fn(),
        },
      });
      res = httpMocks.createResponse();
    });

    it('should return token', async () => {
      const hashMock = jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      // const getUserMock = jest.spyOn(AuthController.prototype)
      await authController.login(req, res);

      expect(hashMock).toBeCalledTimes(1);
      expect(res.statusCode).toEqual(200);
      expect(res._getJSONData().token).toBeDefined();
    });

    it('should return 401', async () => {
      const hashMock = jest.spyOn(argon2, 'verify').mockResolvedValue(false);
      // const getUserMock = jest.spyOn(AuthController.prototype)

      await authController.login(req, res);

      expect(hashMock).toBeCalledTimes(1);
      expect(res.statusCode).toEqual(401);
      expect(res._getJSONData().message).toEqual('unauthorized');
      expect(res._getJSONData().token).toBeUndefined();
    });

    it('should return 500', async () => {
      const hashMock = jest
        .spyOn(argon2, 'verify')
        .mockImplementation(async () => {
          throw new Error('error');
        });
      // const getUserMock = jest.spyOn(AuthController.prototype)

      await authController.login(req, res);

      expect(hashMock).toBeCalledTimes(1);
      expect(res.statusCode).toEqual(500);
      expect(res._getJSONData().message).toEqual('internal server error');
      expect(res._getJSONData().token).toBeUndefined();
    });
  });

  describe('signup', () => {
    it('should return user info', async () => {});
  });
});
