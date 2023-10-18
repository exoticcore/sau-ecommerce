import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadImageDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  is_private?: boolean;
}

export type UploadMessageType = {
  file: Express.Multer.File;
  title: string;
  bucket: string;
  is_pravate: boolean;
};
