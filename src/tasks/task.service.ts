import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateTaskDTO } from './dto/task-create.dto';
import { EditTaskDTO } from './dto/task-edit.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  findAll() {
    return this.taskRepo.find();
  }

  testCSV = () => {
    // Task name -> row
    // Start_time -> column
    // Duration -> cell
    const headers = [
      { id: 1, title: '06-09-2021' },
      { id: 2, title: '01-09-2021' },
      // { id: 'email', title: 'Email' },
    ];

    const data = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
      { id: 3, name: 'Bob Smith', email: 'bob.smith@example.com' },
    ];
    return;
  };

  async findPerUser(id: number) {
    const tasks = await this.taskRepo
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.time_slots', 'time_slots')
      .where('tasks.user_id = :id', { id })
      .select([
        'tasks.title',
        'time_slots.start_time',
        'SUM(time_slots.duration) AS duration',
      ])
      .groupBy('tasks.title')
      .addGroupBy('time_slots.start_time')
      .getRawMany();

    return tasks;
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
