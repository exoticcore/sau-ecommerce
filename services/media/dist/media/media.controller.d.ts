import { MediaService } from './media.service';
import { Response } from 'express';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    getImage(bucket: string, file: string, res: Response): Promise<Response<any, Record<string, any>> | {
        message: string;
    }>;
}
