import { z } from 'zod';
import { BadRequestError } from '../../error';

export type RegisterUserType = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export type UserInfo = {
  sub: string;
  email_verified: boolean;
  roles: string[];
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
};

export const registerValidate = z.object({
  body: z.object({
    email: z
      .string()
      .email()
      .catch(() => {
        throw new BadRequestError('Invalid email address 😫');
      }),
    password: z
      .string()
      .min(5)
      .catch(() => {
        throw new BadRequestError('Invalid password 😩');
      }),
    phone: z.optional(z.string()),
    firstName: z.optional(z.string()),
    lastName: z.optional(z.string()),
  }),
});
