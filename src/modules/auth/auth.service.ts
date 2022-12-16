import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(data): Promise<User> {
    const [error, result] = await User.create(data)
      .then((res) => [null, res.toJSON()])
      .catch((err) => [err]);

    // is error
    if (error) {
      throw new HttpException(
        error.errors[0].message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async login(data: { email: string; password: string }): Promise<User> {
    const [error, result] = await User.findOne({
      where: data,
      attributes: {
        exclude: ['password'],
      },
    })
      .then((res) => [null, res?.toJSON()])
      .catch((err) => [err]);

    // is error
    if (error) {
      throw new HttpException(
        error?.errors[0]?.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // not found user
    if (!result) {
      throw new HttpException('not found user', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
