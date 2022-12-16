import {
  Table,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
  tableName: 'uploads',
  timestamps: true,
})
export class Upload extends Model {
  @Default('default-thumbnail.jpg')
  @Column
  filename: string;

  @Column
  size: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
