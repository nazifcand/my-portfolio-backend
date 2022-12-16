import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Category } from './category.model';
import { Post } from './post.model';

@Table({
  tableName: 'postCategories',
  timestamps: false,
})
export class PostCategory extends Model {
  @ForeignKey(() => Post)
  @Column
  postId: number;

  @ForeignKey(() => Category)
  @Column
  categoryId: number;
}
