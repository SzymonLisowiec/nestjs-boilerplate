import * as Path from 'path';
import * as DotEnv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import { Config } from './config';

DotEnv.config({ path: Path.join(__dirname, '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix(Config.urlPrefix);
  await app.listen(Config.port, Config.host);
}
bootstrap();
