import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { exit } from 'process';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';


async function bootstrap() {
	const logger = new Logger('main.ts - server');
	if (
		process.env.POSTGRES_USER === undefined || process.env.POSTGRES_USER === ''
		|| process.env.POSTGRES_PASSWORD === undefined || process.env.POSTGRES_PASSWORD === ''
		|| process.env.POSTGRES_DB === undefined || process.env.POSTGRES_DB === ''
		|| process.env.PORT_SERVER === undefined || process.env.PORT_SERVER === '' || parseInt(process.env.PORT_SERVER) === Number.NaN || parseInt(process.env.PORT_SERVER) < 80
		|| process.env.JWT_SECRET === undefined || process.env.JWT_SECRET === ''
		|| process.env.JWT_TTL === undefined || process.env.JWT_TTL === '' || parseInt(process.env.JWT_TTL) === Number.NaN || parseInt(process.env.JWT_TTL)< 60
		|| process.env.API_UID === undefined || process.env.API_UID === ''
		|| process.env.API_SECRET === undefined || process.env.API_SECRET === ''
		|| process.env.APP_NAME === undefined || process.env.APP_NAME === ''
		|| (process.env.ENV !== 'DEV' && process.env.ENV !== 'PROD')
	) {
		logger.error(`Incomplete environment`);
		exit(1);
	}
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
	app.enableCors({
		credentials: false,
		origin: '*'
	});
	app.register(require('@fastify/multipart'))
	if (process.env.ENV === 'DEV')
		app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
	else
		app.useLogger(['log', 'error', 'warn']);
	const port: number = (process.env.PORT_SERVER ? parseInt(process.env.PORT_SERVER) : 3000);
	process.env.TTL_REGENERATE = `${ Math.floor(parseInt(process.env.JWT_TTL) * 0.8) }`;
	const ttlRegenerate = process.env.JWT_TTL 
	await app.listen(port, '0.0.0.0');
	logger.log(`Server start on port ${port}`);
}

bootstrap();
