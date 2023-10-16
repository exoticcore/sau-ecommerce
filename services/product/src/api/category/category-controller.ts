import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CategoryService from './category-service';
import { CategoryType } from './category-model';
import { BadRequestError } from '../../error/bad-request';
import axios from 'axios';
import { CustomAPIError } from '../../error/custom-error';

const categoryService = new CategoryService();

// Read All Category in the database
export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();

  if (categories.length === 0)
    return res.status(StatusCodes.OK).json({ message: 'empty category.' });

  return res.status(StatusCodes.OK).json(categories);
};

export const getCategoryByID = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const catID = parseInt(categoryId);

  const category = await categoryService.getCategoryByID(catID);
  if (!category) throw new BadRequestError('category not found');

  return res.status(StatusCodes.OK).json(category);
};

// Insert category infomation into the database
export const createCategory = async (req: Request, res: Response) => {
  const catInfo: CategoryType = req.body;
  const file = req.file;
  const { sub } = res.locals.user;
  let media;

  if (file) {
    const formData = new FormData();
    let buffer = Buffer.from(file.buffer);
    let arraybuffer = Uint8Array.from(buffer).buffer;
    let blob = new Blob([arraybuffer, 'original'], { type: file.mimetype });
    console.log(arraybuffer);
    formData.append('picture', blob);
    formData.append('title', req.body.title);
    media = await axios
      .post(
        'http://localhost:3002/api/v1/media/upload/image/category',
        formData,
        {
          headers: {
            Authorization: 'Bearer ',
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .catch((err) => {
        throw new CustomAPIError();
      });
  }
  const created = await categoryService.createCategory(
    catInfo,
    <string>sub,
    media?.data.file_name
  );
  return res.status(StatusCodes.CREATED).json(created);
};

export const updateCategory = async (req: Request, res: Response) => {
  const catInfo: CategoryType = req.body;
  const { categoryId } = req.params;
  const { sub } = res.locals.user;

  const catID = parseInt(categoryId);

  const isCategory = await categoryService.getCategoryByID(catID);
  if (!isCategory)
    throw new BadRequestError('not found specific id of category');

  const nameCheck = await categoryService.getCategoryByName(catInfo.title);
  if (nameCheck && nameCheck.id !== catID)
    throw new BadRequestError('category name not available');

  const updatedCategory = await categoryService.updateCategory(
    catID,
    catInfo,
    <string>sub
  );

  res.status(StatusCodes.OK).json(updatedCategory);
};

// Delete Category By ID params from database
export const deleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  const isCategory = await categoryService.getCategoryByID(
    parseInt(categoryId)
  );

  if (!isCategory)
    throw new BadRequestError('not fould specific id of category');

  const deletedCategory = await categoryService.deleteCategory(
    parseInt(categoryId)
  );

  return res
    .status(StatusCodes.OK)
    .json({ message: `deleted category: '${deletedCategory.title}'` });
};
