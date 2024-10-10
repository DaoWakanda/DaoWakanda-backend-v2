/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as Cloudinary from 'cloudinary';
import { env } from 'process';
import { fromBuffer } from 'file-type';
import { MIMETYPE } from 'libs/enums/mime.enum';
import { ImageData } from 'libs/interfaces/image-data.interface';
import { generateOtp } from 'libs/utils/generateOtp.util';

@Injectable()
export class FileUploadService {
  constructor() {
    Cloudinary.v2.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadPhoto(
    base64: string,
    oldKey = '',
    dirName = 'avatars',
  ): Promise<ImageData | undefined> {
    const buffer = Buffer.from(base64, 'base64');

    const file = await fromBuffer(buffer);

    if (!file) {
      throw new BadRequestException('');
    }

    const { mime, ext } = file;

    if (!this.validateMimeForImageUpload(mime)) {
      throw new BadRequestException('');
    }

    try {
      console.log('Trying to upload to Cloudinary');
      if (oldKey) {
        this.deleteFromCloudinary(oldKey);
      }
      return await this.uploadToCloudinary(base64, oldKey, dirName, mime);
    } catch (e) {
      console.error('Error uploading to Cloudinary');
      console.error(e);
      throw new InternalServerErrorException('');
    }
  }

  async uploadProfilePhoto(oldKey: string, base64: string) {
    return this.uploadPhoto(base64, oldKey);
  }

  private validateMimeForImageUpload(mime: string): boolean {
    return (
      mime === MIMETYPE.JPEG ||
      mime === MIMETYPE.JPG ||
      mime === MIMETYPE.PNG ||
      mime === MIMETYPE.WEBP
    );
  }

  generateUniqueKey(extension: string, oldKey = '', prefix = 'avatars') {
    const time = Date.now().toString();
    let key: string;

    while (true) {
      key = `${prefix}/${time}-${generateOtp(10)}.${extension}`;

      if (key !== oldKey) {
        break;
      }
    }

    return key;
  }

  async uploadToCloudinary(
    base64: string,
    oldKey: string,
    dirName: string,
    mime: string,
  ): Promise<ImageData | undefined> {
    let publicId: string;

    if (!oldKey) {
      const time = Date.now().toString();
      publicId = `${time}-${generateOtp(10)}`;
    } else {
      publicId = oldKey;
    }

    console.log('Uploading to cloudinary...');

    return new Promise<ImageData>((resolve, reject) => {
      const uri = `data:${mime};base64,${base64}`;
      Cloudinary.v2.uploader.upload(
        uri,
        { folder: dirName, public_id: publicId },
        (error, result) => {
          if (error || !result) {
            reject(error || 'There was a problem uploading the image');
          } else {
            const data: ImageData = {
              imageKey: publicId,
              imageUrl: result.url,
            };
            console.log(`Upload successful. Public ID: ${publicId}`);
            resolve(data);
          }
        },
      );
    });
  }

  async deleteFromCloudinary(key: string) {
    return new Promise<any>((resolve) => {
      Cloudinary.v2.uploader.destroy(key, (error, result) => {
        if (error) {
          resolve(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
