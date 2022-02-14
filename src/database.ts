import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST_DEV,
  POSTGRES_DB_DEV,
  POSTGRES_USER_DEV,
  POSTGRES_PASSWORD_DEV,
  PORT_DEV,
  POSTGRES_HOST_TEST,
  POSTGRES_DB_TEST,
  POSTGRES_USER_TEST,
  POSTGRES_PASSWORD_TEST,
  PORT_TEST,
  ENV,
} = process.env;

// eslint-disable-next-line import/no-mutable-exports
let client: Pool = new Pool();
console.log(`ENV var: ${ENV}`);

if (ENV === 'test') {
  client = new Pool({
    host: POSTGRES_HOST_TEST,
    database: POSTGRES_DB_TEST,
    user: POSTGRES_USER_TEST,
    password: POSTGRES_PASSWORD_TEST,
    port: PORT_DEV as unknown as number,
  });
}

if (ENV === 'dev') {
  client = new Pool({
    host: POSTGRES_HOST_DEV,
    database: POSTGRES_DB_DEV,
    user: POSTGRES_USER_DEV,
    password: POSTGRES_PASSWORD_DEV,
    port: PORT_TEST as unknown as number,
  });
}

export default client;
