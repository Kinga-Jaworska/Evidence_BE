import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/user.service';

import { RegisterUserDTO } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, // private jwtService: JwtService,
  ) {}

  async login(userDTO: RegisterUserDTO) {
    const userExist = await this.userService.findOneByEmail(userDTO.email);

    if (!userExist) {
      const createdUser = await this.userService.createUser(userDTO);
      return createdUser;
    }

    return userExist;
  }
}
