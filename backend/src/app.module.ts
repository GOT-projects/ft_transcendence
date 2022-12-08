import { Module } from '@nestjs/common';
import { jwtModule } from 'src/auth/jwt.module';
import { AppController } from './app.controller';
import { AppGateway } from './gateway/app.gateway';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { multerModule } from './ressources';
import { GeneralGateway } from './gateway/general.gateway';
import { FriendGateway } from './gateway/friend.gateway';
import { ChatGateway } from './gateway/chat.gateway';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    jwtModule,
    multerModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    GeneralGateway,
    FriendGateway,
    ChatGateway,
  ],
})
export class AppModule {}
