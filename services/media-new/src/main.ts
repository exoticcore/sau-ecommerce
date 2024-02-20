import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const options = new DocumentBuilder()
    .setTitle('Media Service API')
    .setDescription('Media management service for scaleable system')
    .setVersion('1.0')
    .addServer(
      `http://localhost:${configService.get('PORT') || 3001}/api/v1/media`,
      'Local environment',
    )
    .addServer(`https://stage.api.nask.com/media`, 'Staging')
    .addServer('https://api.nask.com/media', 'Production')
    .addTag('My Api Tag')
    .addGlobalParameters({
      name: 'language',
      in: 'query',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  app.use(helmet());
  app.setGlobalPrefix('api/v1/media');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.startAllMicroservices();
  await app.listen(configService.get('PORT') || 3001);
}
bootstrap();
