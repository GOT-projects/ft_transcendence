import { Injectable } from '@nestjs/common';
import { CreateRelUserChannelDto } from './dto/create-rel_user_channel.dto';
import { UpdateRelUserChannelDto } from './dto/update-rel_user_channel.dto';

@Injectable()
export class RelUserChannelService {
  create(createRelUserChannelDto: CreateRelUserChannelDto) {
    return 'This action adds a new relUserChannel';
  }

  findAll() {
    return `This action returns all relUserChannel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} relUserChannel`;
  }

  update(id: number, updateRelUserChannelDto: UpdateRelUserChannelDto) {
    return `This action updates a #${id} relUserChannel`;
  }

  remove(id: number) {
    return `This action removes a #${id} relUserChannel`;
  }
}
