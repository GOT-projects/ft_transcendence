import { Body, Controller, Get, Headers, HostParam, HttpException, HttpStatus, Param, Post, Query, Request, Res, ResponseDecoratorOptions } from '@nestjs/common';
import { createSecretKey } from 'crypto';
import { CreateUserDto } from 'src/dtos/users/CreateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get()
    getUsers() {

    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
        if (!createUserDto || !createUserDto.username)
            throw new HttpException("No username gave", HttpStatus.BAD_REQUEST);
        await this.usersService.createUser(createUserDto, response);
    }
}
