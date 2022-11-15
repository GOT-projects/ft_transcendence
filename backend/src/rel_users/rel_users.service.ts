import { Injectable } from '@nestjs/common';
import { CreateRelUserDto } from './dto/create-rel_user.dto';
import { UpdateRelUserDto } from './dto/update-rel_user.dto';

@Injectable()
export class RelUsersService {
  create(createRelUserDto: CreateRelUserDto) {
    return 'This action adds a new relUser';
  }

  findAll() {
    return `This action returns all relUsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} relUser`;
  }

  update(id: number, updateRelUserDto: UpdateRelUserDto) {
    return `This action updates a #${id} relUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} relUser`;
  }
}
