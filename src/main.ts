import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';
import AppConfig from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ValidationPipe());

  const appConfig = app.get(AppConfig);

  const cookieSecret = appConfig.cookieSecret;

  await app.register(fastifyCookie, {
    secret: cookieSecret,
  });

  const { port, host } = appConfig;

  await app.listen(port, host);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
