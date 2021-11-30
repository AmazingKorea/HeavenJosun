import dotenv from 'dotenv';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

// dotenv 설정
dotenv.config();

// docker가 아니라면 localhost DB 이므로 localhost로 치환해주는 게 맞음.
if (process.env.NODE_ENV !== 'docker') process.env.MYSQL_HOST = 'localhost';

export default {
  debug: true,
  metadataProvider: TsMorphMetadataProvider,
  entities: ['./build/src/domain/entities/*'],
  // entitiesTS가 없으면 cannot import가 뜬다.. 도대체 왜 why... 이해할 수 없네
  entitiesTs: ['./src/domain/entities/*'],
  // https://github.com/mikro-orm/mikro-orm/discussions/1214
  type: 'mysql',
  dbName: process.env.MYSQL_DATABASE,
  clientUrl: `mysql://root@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}`,
  password: process.env.MYSQL_ROOT_PASSWORD,
};
