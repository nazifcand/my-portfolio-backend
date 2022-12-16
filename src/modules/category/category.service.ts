import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category } from 'src/models/category.model';
import { User } from 'src/models/user.model';

@Injectable()
export class CategoryService {
  async getCategories(): Promise<Category[]> {
    const [error, result] = await Category.findAll({
      include: [
        {
          as: 'user',
          model: User,
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

  async getCategory(id: number): Promise<Category> {
    const [error, result] = await Category.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['categoryId', 'createdAt', 'updatedAt'],
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

  async createCategory(data): Promise<Category> {
    const [error, result] = await Category.create(data)
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

  async updateCategory(categoryId: number, data): Promise<Category> {
    const [error, result] = await Category.findByPk(categoryId, {
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt'],
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

    // not found category
    if (!result) {
      return null;
    }

    // update
    const [err, updatedCategory] = await result
      .update(data)
      .then((res) => [null, res])
      .catch((err) => [err]);

    // is update error
    if (err) {
      throw new HttpException(
        { message: ['kritical error'] },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const { userId, updatedAt, ...category } = updatedCategory.toJSON();

    return category;
  }

  async deleteCategory(categoryId: number): Promise<number> {
    const [error, result] = await Category.destroy({
      where: {
        id: categoryId,
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
