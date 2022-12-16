import {
  Table,
  Model,
  Column,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany,
  Unique,
} from 'sequelize-typescript';
import { Category } from './category.model';
import { PostCategory } from './postCategory.model';
import { User } from './user.model';
import { Upload } from './upload.model';

@Table({
  tableName: 'posts',
  timestamps: true,
})
export class Post extends Model {
  @Column
  title: string;

  @Unique
  @Column
  slug: string;

  @Default('article')
  @Column
  type: 'article' | 'video';

  @Default('draft')
  @Column
  status: 'draft' | 'published';

  @Column(DataType.TEXT)
  content: string;

  @Column
  summary: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  videoId: string;

  @ForeignKey(() => Upload)
  @Column
  imageId: number;

  @BelongsToMany(() => Category, () => PostCategory)
  categories: Category[];

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Upload)
  image: Upload;
}
