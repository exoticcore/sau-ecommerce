import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SubCatCreateType, SubCatUpdateType } from './subcat-model.js';
import { PutObjectRequest } from 'aws-sdk/clients/s3.js';
import { extension } from 'mime-types';
import * as CustomErrors from '../../error/index.js';

import SubCatService from './subcat-service.js';
const subCatService = new SubCatService();

export const getAllSubCat = async (req: Request, res: Response) => {
  const categories = await subCatService.getAllSubCats();
  if (categories.length <= 0)
    return res
      .status(StatusCodes.OK)
      .json({ message: 'sub category is empty' });

  res.status(StatusCodes.OK).json(categories);
};

export const createSubCat = async (req: Request, res: Response) => {
  const subCatInfo: SubCatCreateType = req.body;
  const file = req.file;
  const { sub } = res.locals.user;

  const isSubCat = await subCatService.getSubCatByTitle(subCatInfo.title);
  if (isSubCat)
    throw new CustomErrors.BadRequestError(
      'title of sub category not available'
    );

  let newFile: string | undefined;
  let params: PutObjectRequest | undefined;

  if (file) {
    const type = extension(file.mimetype);
    newFile = `${subCatInfo.title.replace(' ', '_')}.${type}`;
    const path = `subcat/${newFile}`;
    params = {
      Bucket: <string>process.env.S3_BUCKET,
      Key: path,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  }

  const created = await subCatService.createSubCat(
    subCatInfo,
    <string>sub,
    params,
    newFile
  );

  return res.status(StatusCodes.CREATED).json(created);
};

export const updateSubCat = async (req: Request, res: Response) => {
  const subCatInfo: SubCatUpdateType = req.body;
  const file = req.file;
  const { sub } = res.locals.user;
  const { subCatId } = req.params;
  const parseId = parseInt(subCatId);
  if (!parseId)
    throw new CustomErrors.BadRequestError('sub category id should be number');

  const subCat = await subCatService.getSubCatById(parseId);
  if (!subCat)
    throw new CustomErrors.NotFoundError(
      `not found sub category id ${parseId}`
    );

  let newFile: string | undefined;
  let params: PutObjectRequest | undefined;

  if (file) {
    const type = extension(file.mimetype);
    newFile = `${
      subCatInfo.title?.replace(' ', '_') || subCat.title.replace(' ', '_')
    }.${type}`;
    const path = `subcat/${newFile}`;
    params = {
      Bucket: <string>process.env.S3_BUCKET,
      Key: path,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
  }

  const updated = await subCatService.updateSubCat(
    subCatInfo,
    parseId,
    sub,
    params,
    newFile
  );

  return res.status(StatusCodes.OK).json(updated);
};

export const deleteSubCat = async (req: Request, res: Response) => {
  const { subCatId } = req.params;
  const parseId = parseInt(subCatId);
  if (!parseId)
    throw new CustomErrors.BadRequestError('sub category id should be number');

  const isSubCat = await subCatService.getSubCatById(parseId);
  if (!isSubCat)
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: `sub category id ${parseId} not found` });

  const deleted = await subCatService.deleteSubCat(parseId);

  return res
    .status(StatusCodes.OK)
    .json({ message: `deleted sub category title: ${deleted.title}` });
};
