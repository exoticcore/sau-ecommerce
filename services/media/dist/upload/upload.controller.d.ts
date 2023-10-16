/// <reference types="multer" />
import { UploadService } from './upload.service';
import { UploadImageDTO } from './dto';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadImage(file: Express.Multer.File, bucket: string, body: UploadImageDTO): Promise<{
        id: string;
        title: string;
        file_name: string;
        content_type: string;
        path: string;
        created_at: Date;
        updated_at: Date;
        is_private: boolean;
    }>;
    deleteAll(): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
