import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './exception_filters/prisma-client-exception.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Trip Planner')
    .setDescription('Search a trip from an origin to a destination and sort them by a given strategy')
    .setVersion('1.0')
    .addTag('trips')
    .addApiKey(
      { type: 'apiKey', name: 'x-api-key', in: 'header' },
      'x-api-key',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = configService.get('PORT');
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  await app.listen(port);
  logger.verbose(`Application is running on: http://localhost:${port}`);
  logger.verbose(`Swagger available at: http://localhost:3000/api`)
}
bootstrap();
