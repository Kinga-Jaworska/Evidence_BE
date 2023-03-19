import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const { ENVIRONMENT, DB_PORT, DB_PASSWORD, DB_HOST, DB_NAME, DB_USER } =
  process.env;

export const dbOptions = {
  type: 'postgres',
  // url: DATABASE_URL,
  entities: ['dist/../*.entity{.ts,.js}'],
  password: DB_PASSWORD,
  host: DB_HOST,
  databse: DB_NAME,
  username: DB_USER,
  port: DB_PORT,
  migrations: ['dist/db/migrations/*.js'],
  // synchronize: ENVIRONMENT === 'dev',
  synchronize: true,
  autoLoadEntities: true,
  ssl: ENVIRONMENT === 'dev' ? false : { rejectUnauthorized: false },
};

export const dataSource = new DataSource({
  ...(dbOptions as DataSourceOptions),
});
