import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from 'src/models/category.model';
import { Post } from 'src/models/post.model';
import { Upload } from 'src/models/upload.model';
import { User } from 'src/models/user.model';

@Injectable()
export class PostService {
  async getPosts(): Promise<Post[]> {
    const [error, result] = await Post.findAll({
      where: {},
      include: [
        {
          as: 'user',
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
        {
          as: 'image',
          model: Upload,
        },
        {
          as: 'categories',
          model: Category,
          attributes: {
            exclude: ['userId', 'updatedAt', 'createdAt', 'content'],
          },
        },
      ],
      order: [['createdAt', 'DESC']],
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

  async getPost(slug: string): Promise<Post> {
    const [error, result] = await Post.findOne({
      where: {
        slug,
      },
      include: [
        {
          as: 'user',
          model: User,
          attributes: {
            exclude: ['password'],
          },
        },
        {
          as: 'image',
          model: Upload,
        },
        {
          as: 'categories',
          model: Category,
          attributes: {
            exclude: ['userId', 'updatedAt', 'createdAt', 'content'],
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

  async createPost(data): Promise<Post> {
    /*
      TODO: Burasi icime sinmedi ozellikle set category kismi, .save icin arastirma yap.
      sanirim o komut, zaten category id tabloda yoksa post'u create ettirmiyor bile
    */

    const [error, result] = await Post.create(data)
      .then((res) => [null, res])
      .catch((err) => [err]);

    // is error
    if (error) {
      throw new HttpException(
        { message: ['kritical error'] },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // set categories
    if (data.categories.length) {
      const [err, setCategoryResult] = await result
        .$set('categories', data.categories)
        .then((res) => [null, res])
        .catch((err) => [err]);

      // is error
      if (err) {
        // remove created post
        result.destroy();

        throw new HttpException(
          { message: ['kritical error'] },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return result;
  }

  async updatePost(slug: string, data): Promise<Post> {
    // find post
    const [error, result] = await Post.findOne({
      where: { slug },
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

    //  not found post
    if (!result) return null;

    // update post
    const [err, updatedPost] = await result
      .update(data)
      .then((res) => [null, res])
      .catch((err) => [err]);

    // is error
    if (err) {
      throw new HttpException(
        { message: ['kritical error'] },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // set categories
    if (data.categories?.length) {
      const [err, setCategoryResult] = await result
        .$set('categories', data.categories)
        .then((res) => [null, res])
        .catch((err) => [err]);

      // is error
      if (err) {
        throw new HttpException(
          { message: ['kritical error'] },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return updatedPost;
  }

  async deletePost(slug: string): Promise<number> {
    const [error, result] = await Post.destroy({
      where: {
        slug,
      },
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
