import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { UserController } from './users.controller';

import { TaskService } from 'src/tasks/task.service';
import { UserService } from './user.service';

@Module({
  imports: [User],
  controllers: [UserController],
  providers: [UserService, TaskService],
})
export class UserModule {}
