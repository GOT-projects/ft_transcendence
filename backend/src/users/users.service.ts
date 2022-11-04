import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { DeepPartial, Repository } from 'typeorm';
import { CreateUserParams } from './types';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    findUsers() {

    }

    async createUser(userInfo: CreateUserParams, response: Response) {
        const newUser = this.userRepository.create({
            ...userInfo
        });
        try {
            await this.userRepository.save(newUser);
            
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        return newUser;
    }
}
