import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDTO } from 'src/auth/dto/register-user.dto';
import { Repository } from 'typeorm/repository/Repository';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  getUserTasks(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  add() {
    return this.userRepo.save({});
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepo.findOneBy({ email: email });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepo.findOneBy({ id: id });
  }

  async updateToken(refreshToken: string, id: number) {
    const findUser = await this.userRepo.findOneBy({ id: id });
    return await this.userRepo.save({
      ...findUser,
      refresh_token: refreshToken,
    });
  }

  async createUser(userDTO: RegisterUserDTO): Promise<User> {
    // const hashedPassword = await bcrypt.hash(userDTO.password, 4);

    return await this.userRepo.save({
      email: userDTO.email,
      username: userDTO.username,
    });
  }

  // async getOverall(): Promise<User[]> {
  //   const users = await this.userRepo
  //     .createQueryBuilder('user')
  //     .leftJoinAndSelect('user.tasks', 'task')
  //     .select('user.id', 'userId')
  //     .addSelect('user.name', 'userName')
  //     .addSelect('COUNT(task.id)', 'taskCount')
  //     .groupBy('user.id')
  //     .addGroupBy('user.name')
  //     .getRawMany();

  //   return users;

  //   // return users.map((user) => ({
  //   //   id: user.userId,
  //   //   name: user.userName,
  //   //   taskCount: user.taskCount,
  //   // }));
  // }
}
