/// <reference types="multer" />
import { UploadPictureDTO } from './dto/create-database.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    uploadImage(file: Express.Multer.File, info: UploadPictureDTO): Promise<{
        id: string;
        title: string;
        file_name: string;
        content_type: string;
        local: string;
        is_private: boolean;
    }>;
    getAllCategoryImage(): Promise<{
        id: string;
        title: string;
        file_name: string;
        content_type: string;
        local: string;
        is_private: boolean;
    }>;
    deleteImage(id: string): Promise<{
        id: string;
        title: string;
        file_name: string;
        content_type: string;
        local: string;
        is_private: boolean;
    }>;
    deleteAll(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
