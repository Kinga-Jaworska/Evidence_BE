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

    console.log(userExist);
    return userExist;

    // const user = await this.userService.findOneByEmail(userDTO.email);

    // if (!user) throw new ForbiddenException('Access denied');

    // if (!(await bcrypt.compare(userDTO.password, user.password))) {
    //   throw new ForbiddenException('Access denied');
    // }

    // const tokens = await this.getTokens(user.email, user.id);
    // await this.updateRefreshToken(tokens.refresh_token, user.id);
    // return tokens;
  }
}
