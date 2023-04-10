import { Param } from '@nestjs/common/decorators';
import { Controller, Get, Injectable, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getSelectedUserTasks(@Param('id') id) {
    return this.userService.getUserTasks(id);
  }

  @Post()
  async addUser() {
    return this.userService.add();
  }
}
