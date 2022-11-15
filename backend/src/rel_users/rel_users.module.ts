import { Module } from '@nestjs/common';
import { RelUsersService } from './rel_users.service';
import { RelUsersController } from './rel_users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelUser } from './entities/rel_user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    RelUser
  ])],
  controllers: [RelUsersController],
  providers: [RelUsersService]
})
export class RelUsersModule {}
