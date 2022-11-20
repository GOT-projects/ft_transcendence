import { Module } from '@nestjs/common';
import { jwtModule } from 'src/auth/jwt.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    jwtModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
