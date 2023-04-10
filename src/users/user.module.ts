import { UserController } from './users.controller';
import { User } from './user.entity';
import { Module } from '@nestjs/common';

import { UserService } from './user.service';

@Module({
  imports: [User],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
