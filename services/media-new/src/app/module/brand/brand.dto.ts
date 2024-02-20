import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadBrandDto {
  @ApiProperty({ example: 'Gucci', required: true })
  @IsString()
  @IsNotEmpty()
  brandTitle: string;
}
