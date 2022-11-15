import { Module } from '@nestjs/common';
import { RelUserChannelService } from './rel_user_channel.service';
import { RelUserChannelController } from './rel_user_channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelUserChannel } from './entities/rel_user_channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    RelUserChannel
  ])],
  controllers: [RelUserChannelController],
  providers: [RelUserChannelService]
})
export class RelUserChannelModule {}
