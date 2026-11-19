import { NestFactory } from '@nestjs/core';
import { LoggerService } from '@nestjs/common';
import { AppModule } from './app.module';
import 'dotenv/config';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

function createLogger(): LoggerService {
  const loggerType = process.env.LOGGER_TYPE || 'dev';

  switch (loggerType) {
    case 'json':
      return new JsonLogger();

    case 'tskv':
      return new TskvLogger();

    case 'dev':
    default:
      return new DevLogger();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  app.useLogger(createLogger());
  await app.listen(3000);
}
bootstrap();
