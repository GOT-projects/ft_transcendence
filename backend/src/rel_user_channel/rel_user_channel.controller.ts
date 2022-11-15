import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RelUserChannelService } from './rel_user_channel.service';
import { CreateRelUserChannelDto } from './dto/create-rel_user_channel.dto';
import { UpdateRelUserChannelDto } from './dto/update-rel_user_channel.dto';

@Controller('rel-user-channel')
export class RelUserChannelController {
  constructor(private readonly relUserChannelService: RelUserChannelService) {}

  @Post()
  create(@Body() createRelUserChannelDto: CreateRelUserChannelDto) {
    return this.relUserChannelService.create(createRelUserChannelDto);
  }

  @Get()
  findAll() {
    return this.relUserChannelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.relUserChannelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRelUserChannelDto: UpdateRelUserChannelDto) {
    return this.relUserChannelService.update(+id, updateRelUserChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.relUserChannelService.remove(+id);
  }
}
