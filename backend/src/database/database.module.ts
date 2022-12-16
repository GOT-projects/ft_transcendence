import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Game } from './entities/game.entity';
import { Message } from './entities/message.entity';
import { RelBlock } from './entities/rel_block.entity';
import { RelDemand } from './entities/rel_demand.entity';
import { RelFriend } from './entities/rel_friend.entity';
import { RelUserChannel } from './entities/rel_user_channel.entity';
import { User } from './entities/user.entity';
import { BlockService } from './services/block.service';
import { ChannelService } from './services/channel.service';
import { RelDemandService } from './services/demand.service';
import { RelFriendService } from './services/friend.service';
import { GameService } from './services/game.service';
import { MessageService } from './services/message.service';
import { UserService } from './services/user.service';
import { RelUserChannelService } from './services/user_channel.service';

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
			Channel,
			Game,
			Message,
			RelBlock,
			RelDemand,
			RelFriend,
			RelUserChannel,
			User
		]),
	],
	controllers: [],
	providers: [
		UserService,
		GameService,
		RelDemandService,
		RelFriendService,
		BlockService,
		MessageService,
		ChannelService,
		RelUserChannelService,
	  ],
	exports: [
		UserService,
		GameService,
		RelDemandService,
		RelFriendService,
		BlockService,
		MessageService,
		ChannelService,
		RelUserChannelService,
	],
})
export class DatabaseModule {};