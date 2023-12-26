import request from 'supertest';
import { describe, test, it, expect, beforeEach } from '@jest/globals';
import app from '../../../src/app';

describe('Auth Route Unit Test', () => {
  describe('GET /api/v1/auth/login', () => {
    it('should return 200 with refresh token', async () => {});
    it('should return 401 status with text', async () => {});
  });

  describe('GET /api/v1/auth/admin', () => {
    it('should return 200 with admin token', async () => {});
    it('should return 401 with text', async () => {});
    it('should return 404 with text', async () => {});
  });

  describe('POST /api/v1/auth/register', () => {
    it('should return 201 with userdata', async () => {});
    it('should return 400 with error message', async () => {});
  });

  describe('POST /api/v1/auth/email', () => {
    it('should return 200 with true message', async () => {});
    it('should return 204 with false message', async () => {});
  });

  describe('GET /api/v1/auth/verify', () => {
    it('should return 201', async () => {});
    it('should return 401', async () => {});
  });
});
