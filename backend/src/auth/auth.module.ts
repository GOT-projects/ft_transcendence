import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { jwtModule } from 'src/jwt.module';

@Module({
  imports: [UsersModule, jwtModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
