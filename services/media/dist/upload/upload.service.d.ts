/// <reference types="multer" />
import { PrismaService } from '../prisma/prisma.service';
import { UploadImageDTO } from './dto/upload-image.dto';
export declare class UploadService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    uploadImage(file: Express.Multer.File, bucket: string, dto: UploadImageDTO): Promise<{
        id: string;
        title: string;
        file_name: string;
        content_type: string;
        path: string;
        created_at: Date;
        updated_at: Date;
        is_private: boolean;
    }>;
    deleteAllImage(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
