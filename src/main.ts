import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { TransformInterceptor } from './interceptor.js';
import { swaggerInit } from './swagger.js';

const logger = new Logger();
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
    }),
    {
      logger: process.env.NODE_ENV !== 'dev' ? ['error', 'warn'] : ['verbose'],
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  if (process.env.NODE_ENV === 'dev') swaggerInit(app);

  const port = parseInt(process.env.HTTP_PORT ?? '80');
  await app.listen(port, '0.0.0.0', () => {
    logger.warn(`Server is running on http://127.0.0.1:${port}`);
    logger.warn(`Swagger on http://127.0.0.1:${port}/docs`);
  });
}
bootstrap();
