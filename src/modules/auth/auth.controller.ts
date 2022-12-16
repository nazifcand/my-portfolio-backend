import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import textToHash from 'src/utils/textToHash';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user.model';
import { AuthGuard } from '@nestjs/passport';

class RegisterBodyValidator {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(3)
  firstName: string;

  @IsNotEmpty()
  @MinLength(3)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

class LoginBodyValidator {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
@Controller()
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/auth/register')
  async postRegister(@Body() body: RegisterBodyValidator) {
    // hash password
    body.password = textToHash(body.password);

    // create user
    const user = this.service.register(body);

    return user;
  }

  @Post('/auth/login')
  async postLogin(
    @Body() body: LoginBodyValidator,
  ): Promise<{ token: string; user: User }> {
    // hash password
    body.password = textToHash(body.password);

    // find user
    const user = await this.service.login(body);

    // generate token
    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return { token, user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/auth/me')
  async getMe(@Req() request): Promise<User> {
    return request.user;
  }
}
