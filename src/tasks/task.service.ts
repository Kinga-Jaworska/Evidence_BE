import { CreateTaskDTO } from './dto/task-create.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Task } from './task.entity';
import { EditTaskDTO } from './dto/task-edit.dto';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  findAll() {
    return this.taskRepo.find();
  }

  add(task: CreateTaskDTO) {
    return this.taskRepo.save(task);
  }

  async edit(task: EditTaskDTO, id: number) {
    const foundTask = await this.taskRepo.findOneBy({ id });
    return this.taskRepo.save({ ...foundTask, ...task });
  }

  findOne(id: number) {
    return this.taskRepo.findOneBy({ id });
  }
}
