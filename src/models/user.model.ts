import { Column, Model, Table, Unique } from 'sequelize-typescript';

@Table({
  timestamps: true,
  tableName: 'users',
})
export class User extends Model {
  @Unique
  @Column
  username: string;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Unique
  @Column
  email: string;

  @Unique
  @Column
  phone: string;

  @Column
  password: string;
}
