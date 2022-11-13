import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor( @InjectRepository(User) private userRepository: Repository<User>, ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    try {
      await this.userRepository.save(newUser);  
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
    return newUser;
  }

  async findAll() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    if (!id) {
      throw new HttpException('Need id', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.userRepository.findOneBy({
        id
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (!id || !updateUserDto)
      throw new HttpException('Need id and information of user', HttpStatus.BAD_REQUEST);
    try {
      return await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    if (!id) {
      throw new HttpException('Need id', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.userRepository.delete({
        id
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Add a user to the database if not exist, else UPDATE the user
   */
  async add_or_update(idIntra: number, createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.findOneBy({ idIntra, });
      if (!user)
        return await this.create(createUserDto);
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
