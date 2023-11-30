import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CategoryService from './category-service.js';
import { CategoryType, UploadInfo } from './category-model.js';
import { BadRequestError } from '../../error/bad-request.js';
import { consumer, producer } from '../../config/kafka.js';
import { PutObjectRequest } from 'aws-sdk/clients/s3.js';
import { extension } from 'mime-types';

const categoryService = new CategoryService();

// Read All Category in the database
export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();

  if (categories.length === 0)
    return res.status(StatusCodes.OK).json({ message: 'empty category.' });

  return res.status(StatusCodes.OK).json(categories);
};

// Read Category by ID
export const getCategoryByID = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const catID = parseInt(categoryId);
  if (catID) throw new BadRequestError('category id should be number');

  const category = await categoryService.getCategoryByID(catID);
  if (!category) throw new BadRequestError('category not found');

  return res.status(StatusCodes.OK).json(category);
};

// Insert category infomation into the database
export const createCategory = async (req: Request, res: Response) => {
  const catInfo: CategoryType = req.body;
  const file = req.file;
  const { sub } = res.locals.user;

  const category = await categoryService.getCategoryByTitle(catInfo.title);
  if (category) throw new BadRequestError('title not available');

  let params: PutObjectRequest | undefined | null;
  let newFile: string | undefined | null;

  if (file) {
    const type = extension(file.mimetype);
    newFile = `${catInfo.title.replace(' ', '_')}.${type}`;
    const path = `category/${newFile}`;
    params = {
      Bucket: <string>process.env.S3_BUCKET,
      Key: path,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  }

  const created = await categoryService.createCategory(
    catInfo,
    <string>sub,
    newFile,
    params
  );

  return res.status(StatusCodes.CREATED).json(created);
};

// Update new information into category that selected by ID
export const updateCategory = async (req: Request, res: Response) => {
  let catInfo: CategoryType | null = req.body;
  const file = req.file;
  const { categoryId } = req.params;
  const { sub } = res.locals.user;

  const catID = parseInt(categoryId);
  if (!catID) throw new BadRequestError('category id should be number');

  const isCategory = await categoryService.getCategoryByID(catID);
  if (!isCategory)
    throw new BadRequestError('not found specific id of category');

  if (catInfo?.title) {
    const nameCheck = await categoryService.getCategoryByTitle(catInfo.title);
    if (nameCheck && nameCheck.id !== catID)
      throw new BadRequestError('category name not available');
  }

  let params: PutObjectRequest | undefined;
  let newFile: string | undefined;

  if (file) {
    const type = extension(file.mimetype);
    newFile = `${
      catInfo?.title.replace(' ', '_') || isCategory.title.replace(' ', '_')
    }.${type}`;
    const path = `category/${newFile}`;
    params = {
      Bucket: <string>process.env.S3_BUCKET,
      Key: path,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  }

  const updatedCategory = await categoryService.updateCategory(
    catID,
    catInfo,
    <string>sub,
    newFile,
    params
  );

  res.status(StatusCodes.OK).json(updatedCategory);
};

// Delete Category By ID params from database
export const deleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  const catID = parseInt(categoryId);
  if (!catID) throw new BadRequestError('category id should be nubmer');

  const isCategory = await categoryService.getCategoryByID(catID);

  if (!isCategory)
    throw new BadRequestError('not fould specific id of category');

  const deletedCategory = await categoryService.deleteCategory(
    parseInt(categoryId)
  );

  if (deletedCategory.image) {
    await producer.connect();

    producer.send({
      topic: 'media.delete.image.category',
      messages: [
        {
          value: JSON.stringify({
            catId: deletedCategory.id,
          }),
          key: 'delete_category_image',
        },
      ],
    });
  }

  return res
    .status(StatusCodes.OK)
    .json({ message: `deleted category: '${deletedCategory.title}'` });
};

export const deleteAllCategory = async (req: Request, res: Response) => {
  const deleted = await categoryService.deleteAllCategories();
  return res.status(StatusCodes.OK).json(deleted);
};

// Consumer message from media.upload.image.category at Partition 1: Success, Partition 2: Failed
const createCategoryConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'media.upload.image.category' });
  await consumer.run({
    eachMessage: async ({ partition, message }) => {
      console.log({
        partition,
        key: message.key?.toString(),
        offset: message.offset,
        value: JSON.parse(message.value?.toString() || ''),
      });

      // Partition 1 is Success
      if (partition === 1) {
        const uploadInfo: UploadInfo = JSON.parse(
          message.value?.toString() || ''
        );
        const category = await categoryService.getCategoryByID(
          uploadInfo.catId
        );
        if (category)
          await categoryService.categoryUpdateFromMessage(uploadInfo);
      }
      if (partition === 2) {
        const uploadInfo: UploadInfo = JSON.parse(
          message.value?.toString() || ''
        );
        const category = await categoryService.getCategoryByID(
          uploadInfo.catId
        );
        if (category) await categoryService.deleteCategory(uploadInfo.catId);
      }
    },
  });
};

await createCategoryConsumer();
