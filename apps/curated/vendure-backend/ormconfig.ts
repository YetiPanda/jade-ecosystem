import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'jade_user',
  password: process.env.DATABASE_PASSWORD || 'jade_dev_password',
  database: process.env.DATABASE_NAME || 'jade_marketplace',
  schema: process.env.DATABASE_SCHEMA || 'jade',
  synchronize: false, // NEVER true in production - use migrations
  logging: process.env.DATABASE_LOGGING === 'true',
  entities: [path.join(__dirname, 'src/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'src/migrations/*.{ts,js}')],
  subscribers: [],
});

export default AppDataSource;
