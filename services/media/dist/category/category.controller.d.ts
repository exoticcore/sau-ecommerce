/// <reference types="multer" />
import { CategoryService } from './category.service';
import { UploadPictureDTO } from './dto/create-database.dto';
import { Response } from 'express';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    uploadPicture(file: Express.Multer.File, myInfo: UploadPictureDTO): Promise<{
        id: string;
        title: string;
        file_name: string;
        content_type: string;
        local: string;
        is_private: boolean;
    }>;
    getPicture(param: string, bucket: string, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteAllPicture(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
