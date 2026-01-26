import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

import { UpdateUserInput } from './dto/update-user.input';
import { SignUpInput } from 'src/auth/dto/inputs/signup.input';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

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

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return await this.usersRepository.find();
    
    //INFO: https://www.postgresql.org/docs/9.6/functions-array.html
    return await this.usersRepository.createQueryBuilder('user')
      .andWhere('ARRAY[roles] && ARRAY[:...roles]', { roles })
      .getMany();
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

  async update(id: string, updateUserInput: UpdateUserInput, currentUser: User): Promise<User> {
    const { password, ...rest } = updateUserInput;

    if (password) {
      updateUserInput.password = bcrypt.hashSync(password, 10);
    }

    const user = await this.usersRepository.preload({
      ...rest,
      id: id,
      lastUpdatedBy: currentUser,
    });

    if (!user) {
      throw new BadRequestException(`User with id '${id}' not found`);
    }

    return await this.usersRepository.save(user);
  }

  async block(id: string, currentUser: User): Promise<User> {
    const user = await this.findOneById(id);
    user.isActive = false;
    user.lastUpdatedBy = currentUser;
    return await this.usersRepository.save(user);
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
