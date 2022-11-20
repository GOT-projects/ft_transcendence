import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { User } from "../entities/user.entity";

@Injectable()
export class UserService {
    constructor( @InjectRepository(User) private userRepository: Repository<User>, ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const newUser = this.userRepository.create(createUserDto);
        try {
          await this.userRepository.save(newUser);  
        } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        return newUser;
      }
    
      async findAll(): Promise<User[]> {
        try {
          return await this.userRepository.find();
        } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }
    
      async findOne(id: number): Promise<User | null> {
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
    
      async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        if (!id || !updateUserDto)
          throw new HttpException('Need id and information of user', HttpStatus.BAD_REQUEST);
        try {
          return await this.userRepository.update(id, updateUserDto);
        } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }
    
      async remove(id: number): Promise<DeleteResult> {
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
      async create_or_return(login: string, createUserDto: CreateUserDto) : Promise<User> {
        try {
          const user = await this.userRepository.findOneBy({ login, });
          if (!user)
            return await this.create(createUserDto);
          return user;
        } catch (error) {
          throw new HttpException(error.message, error.status);
        }
      }
}