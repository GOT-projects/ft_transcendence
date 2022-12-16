import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { exit } from 'process';

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
	if (process.env.POSTGRES_USER === undefined
		|| process.env.POSTGRES_PASSWORD === undefined
		|| process.env.POSTGRES_DB === undefined
		|| process.env.PORT_SERVER === undefined
		|| process.env.JWT_SECRET === undefined
		|| process.env.JWT_TTL === undefined
		|| process.env.API_UID === undefined
		|| process.env.API_SECRET === undefined
		|| process.env.APP_NAME === undefined) {
		logger.error(`Incomplete environment`);
		exit(1);
	}
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		credentials: false,
		origin: '*'
	});
	app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']); // TODO rm for prod
	const port: number = (process.env.PORT_SERVER ? parseInt(process.env.PORT_SERVER) : 3000);
	process.env.TTL_REGENERATE = `${ Math.floor(parseInt(process.env.JWT_TTL) * 0.8) }`;
	const ttlRegenerate = process.env.JWT_TTL 
	await app.listen(port);
	logger.log(`Server start on port ${port}`);
}

bootstrap();
