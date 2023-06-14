import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { UserController } from './users.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';
import { TaskService } from 'src/tasks/task.service';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, TaskService, GoogleDriveService],
  exports: [UserService],
})
export class UserModule {}
