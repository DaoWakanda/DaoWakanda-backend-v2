import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBase64 } from 'class-validator';

export class UploadImageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBase64()
  base64: string;
}
