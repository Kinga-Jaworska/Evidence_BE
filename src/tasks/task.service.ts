import { CreateTaskDTO } from './dto/task-create.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  async findAll() {
    return this.taskRepo.find();
  }

  add(task: CreateTaskDTO) {
    return this.taskRepo.save(task);
  }

  findOne(id: number) {
    return this.taskRepo.findOneBy({ id });
  }
}
