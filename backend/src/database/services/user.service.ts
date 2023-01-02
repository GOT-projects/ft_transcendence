import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, IsNull, Repository, UpdateResult } from "typeorm";
import { User } from "../entities/user.entity";
import { PartialType } from "@nestjs/swagger";
import { GOT } from "shared/types";

export class CreateUserDto {
		twoFactorAuthenticationSecret?: string;
		isTwoFactorAuthenticationEnabled!: boolean;
		login!: string;
		//username!: string;
		urlImg!: string;
		wallet!: number;
		email!: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
		id?: number | undefined;
		ball: GOT.EnumBall;
		color: string;
}


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

	async countAll() {
		try {
			return await this.userRepository.count();
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

	async findUnique(id: number, login: string): Promise<User | null> {
		if (!id || !login) {
			throw new HttpException('Need id', HttpStatus.BAD_REQUEST);
		}
		try {
			return await this.userRepository.findOneBy({
				id,
				login
			});
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	async findUniqueMail(id: number, email: string): Promise<User | null> {
		if (!id || !email) {
			throw new HttpException('Need id', HttpStatus.BAD_REQUEST);
		}
		try {
			return await this.userRepository.findOneBy({
				id,
				email
			});
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	  async findLogin(login: string): Promise<User | null> {
		if (!login) {
		  throw new HttpException('Need id', HttpStatus.BAD_REQUEST);
		}
		try {
		  return await this.userRepository.findOneBy({
			login
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
	async create_or_return(email: string, createUserDto: CreateUserDto) : Promise<User> {
		try {
			const user = await this.userRepository.findOneBy({ email, });
			if (!user)
				return await this.create(createUserDto);
			return user;
		} catch (error) {
			throw new HttpException(error.message, error.status);
		}
	}

	async setTwoFactorAuthenticationSecret(secret: string, id: number) {
			const user = await this.userRepository.findOneBy({ id, });
			if (!user)
				return null;
			user.twoFactorAuthenticationSecret = secret;
			return await this.userRepository.update(id, user);
	}

	async turnOnTwoFactorAuthentication(id: number) {
		const user = await this.userRepository.findOneBy({ id, });
		if (!user)
				return null;
		user.isTwoFactorAuthenticationEnabled = true;
		await this.userRepository.update(id, user);
	}
	async turnOffTwoFactorAuthentication(id: number) {
		const user = await this.userRepository.findOneBy({ id, });
		if (!user)
				return null;
		user.isTwoFactorAuthenticationEnabled = false;
		await this.userRepository.update(id, {isTwoFactorAuthenticationEnabled: false, twoFactorAuthenticationSecret: undefined });
	}
}
