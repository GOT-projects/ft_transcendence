import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {abortOnError: false}
  );
  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']); // TODO rm for prod
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
