import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { fileFilter } from './helpers/file-filter.helper';

@Controller('files')
export class FilesController {

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File not found. Make sure the file is an image')
    }
    return {
      file: file.originalname
    };
  }
}

