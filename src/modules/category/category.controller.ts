import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  Body,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
  HttpCode,
  Res,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import {
  IsNumberString,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Category } from 'src/models/category.model';
import slugify from 'slugify';
import { Response } from 'express';

class CategoryParamValidator {
  @IsNumberString()
  categoryId: number;
}

class CreateCategoryBodyValidator {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @MinLength(3)
  @IsOptional()
  color: string;

  @IsOptional()
  @MinLength(3)
  content: string;
}

class UpdateCategoryBodyValidator {
  @IsOptional()
  @MinLength(3)
  title: string;

  @IsOptional()
  @MinLength(3)
  color: string;

  @IsOptional()
  @MinLength(3)
  content: string;
}

@Controller()
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get('/categories')
  async getCategories(): Promise<Category[]> {
    return await this.service.getCategories();
  }

  @Get('/categories/:categoryId')
  async getCategory(
    @Param() params: CategoryParamValidator,
  ): Promise<Category> {
    const category = await this.service.getCategory(params.categoryId);

    // not found category
    if (!category) {
      throw new HttpException({ message: ['not found'] }, HttpStatus.NOT_FOUND);
    }

    return category;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/categories')
  async postCategory(
    @Req() request,
    @Body() body: CreateCategoryBodyValidator,
  ): Promise<Category> {
    const { user } = request;

    // set user id
    body['userId'] = user.id;

    // set slug
    body['slug'] = slugify(body.title, { lower: true });

    const createdCategory = await this.service.createCategory(body);

    return createdCategory;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/categories/:categoryId')
  async putCategory(
    @Req() request,
    @Param() params: CategoryParamValidator,
    @Body() body: UpdateCategoryBodyValidator,
  ): Promise<Category> {
    const { user } = request;

    // set user id
    body['userId'] = user.id;

    // if exists title set slug
    if (body.title) {
      body['slug'] = slugify(body.title, { lower: true });
    }

    const updatedCategory = await this.service.updateCategory(
      params.categoryId,
      body,
    );

    // not found category
    if (!updatedCategory) {
      throw new HttpException({ message: ['not found'] }, HttpStatus.NOT_FOUND);
    }

    return updatedCategory;
  }

  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/categories/:categoryId')
  async deleteCategory(
    @Param() params: CategoryParamValidator,
  ): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await this.service.deleteCategory(params.categoryId);

    // not found category
    if (result == 0) {
      throw new HttpException({ message: ['not found'] }, HttpStatus.NOT_FOUND);
    }

    return 'ok';
  }
}
