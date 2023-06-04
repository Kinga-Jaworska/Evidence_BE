// import { Injectable } from '@nestjs/common';
// import { HttpStatus } from '@nestjs/common/enums';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from 'src/users/user.service';

// import { ForbiddenException, HttpException } from '@nestjs/common/exceptions';
// import * as bcrypt from 'bcrypt';
// import { LoginUserDTO } from './dto/login-user.dto';

// import { RegisterUserDTO } from './dto/register-user.dto';
// import { Tokens } from './types';

// @Injectable()
// export class AuthService {
//   constructor(
//     private userService: UserService,
//     private jwtService: JwtService,
//   ) {}

//   async register(userDTO: RegisterUserDTO) {
//     const { email, password } = userDTO;
//     const user = await this.userService.findOneByEmail(email);

//     if (user) {
//       throw new HttpException(
//         'Cannot create user with this credentials',
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     const createdUser = await this.userService.createUser({
//       email,
//       password,
//     });

//     const tokens = await this.getTokens(createdUser.email, createdUser.id);
//     await this.updateRefreshToken(tokens.refresh_token, createdUser.id);
//     return {
//       access_token: tokens.access_token,
//       refresh_token: tokens.refresh_token,
//     };
//   }

//   async login(userDTO: LoginUserDTO): Promise<Tokens> {
//     const user = await this.userService.findOneByEmail(userDTO.email);

//     if (!user) throw new ForbiddenException('Access denied');

//     if (!(await bcrypt.compare(userDTO.password, user.password))) {
//       throw new ForbiddenException('Access denied');
//     }

//     const tokens = await this.getTokens(user.email, user.id);
//     await this.updateRefreshToken(tokens.refresh_token, user.id);
//     return tokens;
//   }

//   async updateRefreshToken(refreshToken: string, userId: number) {
//     const hashedToken = await bcrypt.hash(refreshToken, 4);
//     return this.userService.updateToken(hashedToken, userId);
//   }

//   async refreshToken(userId: number, refreshToken: string) {
//     const user = await this.userService.findOneById(userId);
//     if (!user) throw new ForbiddenException('Access Denied');

//     const refreshMatch = await bcrypt.compare(refreshToken, user.refresh_token);

//     if (!refreshMatch || !user.refresh_token)
//       throw new ForbiddenException('Access Denied');

//     const tokens = await this.getTokens(user.email, user.id);
//     await this.userService.updateToken(tokens.refresh_token, user.id);

//     return tokens;
//   }

//   async logout(userId: number) {
//     await this.userService.updateToken(null, userId);
//   }

//   private async getTokens(email: string, id: number) {
//     const [access_token, refresh_token] = await Promise.all([
//       this.jwtService.signAsync(
//         {
//           sub: id,
//           email: email,
//         },
//         {
//           secret: `${process.env.JWT_SECRET}`,
//           expiresIn: `${process.env.JWT_SECRET_EXPIRES}`,
//         },
//       ),
//       this.jwtService.signAsync(
//         {
//           sub: id,
//           email: email,
//         },
//         {
//           secret: `${process.env.JWT_REFRESH_SECRET}`,
//           expiresIn: `${process.env.JWT_REFRESH_SECRET_EXPIRES}`,
//         },
//       ),
//     ]);

//     return { access_token, refresh_token };
//   }
// }
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDTO } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async signIn(user) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.findUserByEmail(user.email);

    if (!userExists) {
      return this.registerUser(user);
    }

    return this.generateJwt({
      sub: userExists.id,
      email: userExists.email,
    });
  }

  async registerUser(user: RegisterUserDTO) {
    try {
      const newUser = this.userRepository.create(user);
      // newUser. = generateFromEmail(user.email, 5);

      await this.userRepository.save(newUser);

      return this.generateJwt({
        sub: newUser.id,
        email: newUser.email,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async findUserByEmail(email) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      return null;
    }

    return user;
  }
}
