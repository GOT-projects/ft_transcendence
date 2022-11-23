import { Module } from '@nestjs/common';
import { jwtModule } from 'src/auth/jwt.module';
import { AppController } from './app.controller';
import { AppGateway } from './gateway/app.gateway';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { multerModule } from './ressources';
import { GatewayService } from './gateway/gateway.service';

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
    GatewayService
  ],
})
export class AppModule {}
