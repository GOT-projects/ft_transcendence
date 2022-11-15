import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelUsersService } from './rel_users.service';
import { CreateRelUserDto } from './dto/create-rel_user.dto';
import { UpdateRelUserDto } from './dto/update-rel_user.dto';

@Controller('rel-users')
export class RelUsersController {
  constructor(private readonly relUsersService: RelUsersService) {}

  @Post()
  create(@Body() createRelUserDto: CreateRelUserDto) {
    return this.relUsersService.create(createRelUserDto);
  }

  @Get()
  findAll() {
    return this.relUsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relUsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRelUserDto: UpdateRelUserDto) {
    return this.relUsersService.update(+id, updateRelUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relUsersService.remove(+id);
  }
}
