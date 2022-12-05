import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Game } from './entities/game.entity';
import { Message } from './entities/message.entity';
import { RelUser } from './entities/rel_user.entity';
import { RelUserChannel } from './entities/rel_user_channel.entity';
import { User } from './entities/user.entity';
import { GameService } from './services/game.service';
import { MessageService } from './services/message.service';
import { RelUserService } from './services/rel_user.service';
import { UserService } from './services/user.service';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'postgres',
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			autoLoadEntities: true,
			synchronize: true, // TODO rm for prod
		}),
		TypeOrmModule.forFeature([
			User,
			Channel,
			Game,
			Message,
			RelUser,
			RelUserChannel
		]),
	],
	controllers: [],
	providers: [
		UserService,
		GameService,
		RelUserService,
		MessageService
	  ],
	exports: [
		UserService,
		GameService,
		RelUserService,
		MessageService
	],
})
export class DatabaseModule {};