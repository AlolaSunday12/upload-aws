import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { uploadImages } from './utils/aws';

@Injectable()
export class UploadService {
  async uploadFiles(files: Array<Express.Multer.File>) {
    try {
      return await uploadImages(files);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Image upload service error: ${error.message}`
);
      }
      throw new InternalServerErrorException(
        'Unknown error in image upload service.'
 );
    }
  }
}

