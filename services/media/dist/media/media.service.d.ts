import { PrismaService } from '../prisma/prisma.service';
export declare class MediaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getImage(bucket: string, fileName: string): Promise<{
        id: string;
        title: string;
        file_name: string;
        content_type: string;
        path: string;
        created_at: Date;
        updated_at: Date;
        is_private: boolean;
    }>;
}
