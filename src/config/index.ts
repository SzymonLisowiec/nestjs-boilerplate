import database from './database';

export const Config: Record<string, any> = {
  host: process.env.HOST || '127.0.0.1',
  port: +process.env.PORT || 8080,
  prefix: process.env.PREFIX || '',
  database,
};
