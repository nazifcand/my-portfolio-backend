import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly service: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: { userId: number; email: string }): Promise<User> {
    const [error, result] = await User.findOne({
      where: {
        id: payload.userId,
        email: payload.email,
      },
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
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return result;
  }
}
