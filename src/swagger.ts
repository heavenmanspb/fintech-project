import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerInit = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Fintech')
    .setDescription('Test task on nest.js with typeorm')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};
