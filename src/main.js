import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { I18nMiddleware } from './i18n.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, FastifyAdapter);
  await app.listen(3000);
}
bootstrap();
