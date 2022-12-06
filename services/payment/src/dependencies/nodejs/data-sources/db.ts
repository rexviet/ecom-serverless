import { DataSource } from 'typeorm';
import * as path from 'path';
import { RDS } from 'aws-sdk';

let connected = false;
const entitiesPath = path.resolve(__dirname + '/*.entity.js');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [entitiesPath],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
  // migrations: ['migration/*{.ts,.js}'],
  // logging: true,
});

const getToken = async (): Promise<string> => {
  const signer = new RDS.Signer({
    hostname: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    region: 'ap-southeast-1',
  });
  console.log('signer:', signer);
  return signer.getAuthToken({});
};

export const connect = async () => {
  if (connected) {
    return;
  }

  const token = await getToken();
  console.log('token:', token);
  AppDataSource.setOptions({ password: token });
  await AppDataSource.initialize();
  connected = AppDataSource.isInitialized;
};
