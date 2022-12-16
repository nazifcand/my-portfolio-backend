import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  MinLength,
} from 'class-validator';
import slugify from 'slugify';
import { Post as PostModel } from 'src/models/post.model';
import { PostService } from './post.service';
import * as showdown from 'showdown';

class PostParamValidator {
  slug: string;
}

class CreatePostBodyValidator {
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsIn(['article', 'video'])
  type: string;

  @IsOptional()
  @IsIn(['draft', 'published'])
  status: string;

  @IsOptional()
  content: string;

  @IsOptional()
  summary: string;

  @IsOptional()
  videoId: string;

  @IsOptional()
  imageId: string;

  @IsOptional()
  @IsNumber({ allowNaN: false }, { each: true })
  categories: number[] | string[];
}

class UpdatePostBodyValidator {
  @IsOptional()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsIn(['article', 'video'])
  type: string;

  @IsOptional()
  @IsIn(['draft', 'published'])
  status: string;

  @IsOptional()
  content: string;

  @IsOptional()
  summary: string;

  @IsOptional()
  videoId: string;

  @IsOptional()
  @IsNumber({ allowNaN: false }, { each: true })
  categories: number[];
}

@Controller()
export class PostController {
  constructor(private readonly service: PostService) {}

  @Get('/posts')
  async getPosts(): Promise<PostModel[]> {
    return await this.service.getPosts();
  }

  @Get('/posts/:slug')
  async getPost(@Param() params: PostParamValidator): Promise<any> {
    const { slug } = params;

    const post = await this.service.getPost(slug);

    if (!post) {
      throw new HttpException({ message: ['not found'] }, HttpStatus.NOT_FOUND);
    }

    const converter = new showdown.Converter();

    return {
      ...post.toJSON(),
      htmlContent: converter.makeHtml(post.content),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/posts')
  async postPost(
    @Req() request,
    @Body() body: CreatePostBodyValidator,
  ): Promise<PostModel> {
    const { user } = request;

    // set slug
    body['slug'] = slugify(body.title, { lower: true });

    // set user
    body['userId'] = user.id;

    const result = await this.service.createPost(body);

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/posts/:slug')
  async updatePost(
    @Param() params: PostParamValidator,
    @Body() body: UpdatePostBodyValidator,
    @Req() request,
  ): Promise<PostModel> {
    const { user } = request;
    const { slug } = params;

    // set slug
    if (body.title) {
      body['slug'] = slugify(body.title, { lower: true });
    }

    // set user
    body['userId'] = user.id;

    const result = await this.service.updatePost(slug, body);

    // not found post
    if (!result) {
      throw new HttpException({ message: ['not found'] }, HttpStatus.NOT_FOUND);
    }

    return result;
  }

  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/posts/:slug')
  async deletePost(@Param() params: PostParamValidator): Promise<string> {
    const { slug } = params;

    const result = await this.service.deletePost(slug);

    if (result == 0) {
      throw new HttpException({ message: ['not found'] }, HttpStatus.NOT_FOUND);
    }

    return 'ok';
  }
}
