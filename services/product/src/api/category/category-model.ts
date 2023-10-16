import { z } from 'zod';
import { BadRequestError } from '../../error/bad-request';

export type CategoryType = {
  title: string;
  description?: string | null;
  image?: string | null;
};

export const createCategoryValidate = z.object({
  body: z.object({
    title: z.string().catch((err) => {
      throw new BadRequestError('title is null');
    }),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const categoryIDValidate = z.object({
  params: z.object({
    categoryId: z.number().catch((err) => {
      throw new BadRequestError('category id should be number');
    }),
  }),
});
