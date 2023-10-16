import { z } from 'zod';
import { BadRequestError } from '../../error';

export type LoginType = {
  email: string;
  password: string;
  remember_me?: boolean;
};

export const loginValidate = z.object({
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
  }),
});
