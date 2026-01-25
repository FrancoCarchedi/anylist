import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SignUpInput } from './dto/inputs';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken( userId : string ) {
    return this.jwtService.sign({ id: userId });
  }

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    
    const user = await this.usersService.create(signUpInput);
    const token = this.getJwtToken(user.id);

    return { token, user };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {

    const user = await this.usersService.findOneByEmail(loginInput.email);
    const isValidPassword = bcrypt.compareSync(loginInput.password, user.password);

    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.getJwtToken(user.id);

    return { token, user };
  }

  async validateUserById(userId: string): Promise<User> {

    const user = await this.usersService.findOneById(userId);

    if (user.isActive === false) {
      throw new UnauthorizedException('User is inactive');
    }

    delete user.password;

    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);
    return { token, user };
  }
}
