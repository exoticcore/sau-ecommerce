import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadImageDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  is_private?: boolean;
}
