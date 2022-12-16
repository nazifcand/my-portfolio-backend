import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/utils/multerStorage';
import { UploadService } from './upload.service';
import { Upload } from 'src/models/upload.model';

class UploadParamValidator {
  id: number | string;
}

@Controller()
export class UploadController {
  constructor(private readonly service: UploadService) {}

  @Get('/uploads')
  async getUploads(): Promise<Upload[]> {
    return await this.service.getUploads();
  }

  @Get('/uploads/:id')
  async getUpload(@Param() params: UploadParamValidator): Promise<Upload> {
    return await this.service.getUpload(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/uploads')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async postUploads(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
  ): Promise<Upload> {
    const createdUpload = await this.service.createUpload({
      filename: file.filename,
      size: file.size,
      userId: request.user.id,
    });

    return createdUpload;
  }

  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/uploads/:id')
  async deleteUploads(@Param() params: UploadParamValidator): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await this.service.deleteUpload(params.id);

    // not found category
    if (result == 0) {
      throw new HttpException({ message: ['not found'] }, HttpStatus.NOT_FOUND);
    }

    return 'ok';
  }
}
