import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { jwtModule } from 'src/jwt.module';
import { AtStrategy, RtStrategy } from './strategies';
import {JwtModule} from '@nestjs/jwt';

@Module({
  imports: [UsersModule, jwtModule, JwtModule.register({})],
  providers: [AuthService, AtStrategy, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
