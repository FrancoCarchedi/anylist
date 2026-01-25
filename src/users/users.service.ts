import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import { UpdateUserInput } from './dto/update-user.input';
import { SignUpInput } from 'src/auth/dto/inputs/signup.input';

@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signUpInput: SignUpInput): Promise<User> {
    
    try {
      const newUser = this.usersRepository.create({
        ...signUpInput,
        password: bcrypt.hashSync(signUpInput.password, 10),
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: string): Promise<User> {
    throw new Error(`Method not implemented.`);
  }

  private handleDBErrors(error: any): never {

    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    if (error.code === 'error-001') {
      throw new BadRequestException(error.detail.replace('Key ', ''));
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');

  }
}
