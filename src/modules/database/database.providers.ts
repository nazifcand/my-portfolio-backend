import { Sequelize } from 'sequelize-typescript';
import { Category } from 'src/models/category.model';
import { Post } from 'src/models/post.model';
import { PostCategory } from 'src/models/postCategory.model';
import { Upload } from 'src/models/upload.model';
import { User } from 'src/models/user.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        logging: false,
      });

      sequelize.addModels([User, Category, Post, PostCategory, Upload]);
      await sequelize.sync({ alter: true });

      return sequelize;
    },
  },
];
