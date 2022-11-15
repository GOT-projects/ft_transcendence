import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';
import { GameModule } from './game/game.module';
import { RelUserChannelModule } from './rel_user_channel/rel_user_channel.module';
import { RelUsersModule } from './rel_users/rel_users.module';
import { SocketModule } from './socket/socket.module';

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
    SocketModule,
    AuthModule,
    UsersModule,
    ChannelsModule,
    MessagesModule,
    GameModule,
    RelUserChannelModule,
    RelUsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
