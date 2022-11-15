import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelsService {

  constructor (
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
  ) {}

  async create(createChannelDto: CreateChannelDto): Promise<Channel> {
    const newChannel = this.channelRepository.create(createChannelDto);
    try {
      return await this.channelRepository.save(newChannel);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Channel[]> {
    try {
      return await this.channelRepository.find();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number): Promise<Channel | null> {
    if (!id) {
      throw new HttpException('Need id', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.channelRepository.findOneBy({
        id
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateChannelDto: UpdateChannelDto): Promise<UpdateResult> {
    if (!id || !updateChannelDto)
      throw new HttpException('Need id and information of user', HttpStatus.BAD_REQUEST);
    try {
      return await this.channelRepository.update(id, updateChannelDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    if (!id) {
      throw new HttpException('Need id', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.channelRepository.delete({
        id
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
