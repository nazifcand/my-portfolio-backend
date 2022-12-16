import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Upload } from 'src/models/upload.model';
import { User } from 'src/models/user.model';

@Injectable()
export class UploadService {
  async getUploads(): Promise<Upload[]> {
    const [error, result] = await Upload.findAll({
      where: {},
      include: [
        {
          as: 'user',
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    })
      .then((res) => [null, res])
      .catch((err) => [err]);

    // is error
    if (error) {
      throw new HttpException(
        { message: ['kritical error'] },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async getUpload(id: number | string): Promise<Upload> {
    const [error, result] = await Upload.findByPk(id, {
      include: [
        {
          as: 'user',
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
      ],
    })
      .then((res) => [null, res?.toJSON()])
      .catch((err) => [err]);

    // is error
    if (error) {
      throw new HttpException(
        { message: ['kritical error'] },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // not found
    if (!result) {
      throw new HttpException({ message: ['not found'] }, HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async createUpload(data): Promise<Upload> {
    const [error, result] = await Upload.create(data)
      .then((res) => [null, res?.toJSON()])
      .catch((err) => [err]);

    // is error
    if (error) {
      throw new HttpException(
        { message: ['kritical error'] },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async deleteUpload(id: number | string): Promise<number> {
    const [error, result] = await Upload.destroy({
      where: { id },
    })
      .then((res) => [null, res])
      .catch((err) => [err]);

    // is error
    if (error) {
      throw new HttpException(
        { message: ['kritical error'] },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }
}
