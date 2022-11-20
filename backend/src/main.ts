import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/*
import { GOT } from 'shared/types';
class A implements GOT.User {
  id: number;
  idIntra?: number;
  login: string;
  username: string;
  urlImg: string;
  wallet: number;
}
*/

async function bootstrap() {
  const logger = new Logger('main.ts - server');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: false,
    origin: '*'
  });
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']); // TODO rm for prod
  const port: number = (process.env.PORT_SERVER ? parseInt(process.env.PORT_SERVER) : 3000);
  await app.listen(port);
  logger.log(`Server start on port ${port}`);
}

bootstrap();
