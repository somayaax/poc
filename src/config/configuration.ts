import { AppConfig } from './app.config';
import { createProfiguration } from '@golevelup/profiguration';

const requiredEnv = process.env.NODE_ENV === 'test' ? '' : null;
export const config = createProfiguration<AppConfig>(
  {
    port: {
      default: 3000,
      env: 'PORT',
    },
    database: {
      uri: {
        default: requiredEnv,
        format: String,
        env: 'DATABASE_URI',
      },
    },
    jwt: {
      secret: {
        default: requiredEnv,
        format: String,
        env: 'JWT_SECRET',
      },
      expiresIn: {
        default: '1d',
        env: 'JWT_EXPIRES_IN',
      },
    },
    superAdmin: {
      email: {
        default: requiredEnv,
        format: String,
        env: 'SUPERADMIN_EMAIL',
      },
      password: {
        default: requiredEnv,
        format: String,
        env: 'SUPERADMIN_PASSWORD',
      },
      allowSeeding: {
        default: false,
        env: 'ALLOW_SEEDING',
      },
    },
  },
  {
    strict: true,
    loadRelativeTo: 'cwd',
  },
);
