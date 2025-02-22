import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service'; 
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  async uploadImages(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images uploaded');
    }

    try {
      const uploadedImages = await this.uploadService.uploadFiles(files);
      return {
        message: 'Images uploaded successfully',
        images: uploadedImages
};
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException(
          `Upload failed: ${error.message}`
        );
      }
      throw new InternalServerErrorException(
        'An unknown error occurred during file upload.');
      }
    }
  }



