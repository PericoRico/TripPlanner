import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);
  logger.verbose(`Application is running on: http://localhost:${port}`);
}
bootstrap();
