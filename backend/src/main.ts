import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: false,
  });
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']); // TODO rm for prod
  await app.listen(3000);
}

bootstrap();
