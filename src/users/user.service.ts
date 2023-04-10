import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  getUserTasks(id) {
    return this.userRepo.findOneBy({ id });
  }

  add() {
    return this.userRepo.save({});
  }
}
