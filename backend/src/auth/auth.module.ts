import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtModule } from 'src/auth/jwt.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, jwtModule, DatabaseModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
