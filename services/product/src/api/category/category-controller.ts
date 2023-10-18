import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import CategoryService from './category-service';
import { CategoryType, UploadInfo } from './category-model';
import { BadRequestError } from '../../error/bad-request';
import { consumer, producer } from '../../config/kafka';

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

  const category = await categoryService.getCategoryByTitle(catInfo.title);
  if (category) throw new BadRequestError('title not available');

  const created = await categoryService.createCategory(catInfo, <string>sub);

  if (file) {
    await producer.connect();

    producer.send({
      topic: 'media.upload.image.category',
      messages: [
        {
          value: JSON.stringify({
            file,
            title: catInfo.title,
            catId: created.id,
          }),
          key: 'image',
          partition: 0,
        },
      ],
    });

    await producer.disconnect();
    // const formData = new FormData();
    // let buffer = Buffer.from(file.buffer);
    // let arraybuffer = Uint8Array.from(buffer).buffer;
    // let blob = new Blob([arraybuffer, 'original'], { type: file.mimetype });
    // // console.log(arraybuffer);
    // formData.append('picture', blob);
    // formData.append('title', req.body.title);

    // media = await axios
    //   .post(
    //     'http://localhost:3002/api/v1/media/upload/image/category',
    //     formData,
    //     {
    //       headers: {
    //         Authorization: 'Bearer ',
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     }
    //   )
    //   .catch((err) => {
    //     throw new CustomAPIError();
    //   });
  }

  return res.status(StatusCodes.CREATED).json(created);
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

export const updateCategory = async (req: Request, res: Response) => {
  const catInfo: CategoryType = req.body;
  const { categoryId } = req.params;
  const { sub } = res.locals.user;

  const catID = parseInt(categoryId);

  const isCategory = await categoryService.getCategoryByID(catID);
  if (!isCategory)
    throw new BadRequestError('not found specific id of category');

  const nameCheck = await categoryService.getCategoryByTitle(catInfo.title);
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

await createCategoryConsumer();
