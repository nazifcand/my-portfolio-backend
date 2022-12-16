import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Unique,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'categories',
  timestamps: true,
})
export class Category extends Model {
  @Column
  title: string;

  @Unique
  @Column
  slug: string;

  @Column
  color: string;

  @Column(DataType.TEXT)
  content: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
