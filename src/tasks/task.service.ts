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

  async findPerUser(id) {
    // const sum = await this.taskRepo

    //   .createQueryBuilder('tasks')
    //   .leftJoinAndSelect('tasks.time_slots', 'time_slots')
    //   .where('tasks.user_id = :id', { id: 1 })
    //   .select('SUM(tasks.id)', 'sum')
    //   // .where('tasks.user_id = :id', { id: 1 })
    //   .getMany();

    // console.log(sum);

    // const tasks = await this.taskRepo
    //   .createQueryBuilder('task')
    //   .leftJoinAndSelect('task.time_slots', 'time_slots')
    //   .where('task.user_id = :id', { id: 1 })
    //   .select([
    //     'task.id',
    //     'task.title',
    //     'task.description',
    //     'SUM(time_slots.duration) AS duration',
    //   ])

    //   .groupBy('task.id')

    //   .getMany();

    const tasks = await this.taskRepo
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.time_slots', 'time_slots')
      .where('tasks.user_id = :id', { id: 1 })
      .select([
        'tasks.id',
        'tasks.title',
        'tasks.description',
        'time_slots.start_time',
        'SUM(time_slots.duration) AS duration',
      ])
      .groupBy('tasks.id, time_slots.id, time_slots.start_time')
      // .groupBy('tasks.id')
      // .addGroupBy('time_slots.start_time')
      .getMany();
    // console.log(tasks);

    tasks.map((task) => console.log(task['time_slots']));

    return (
      this.taskRepo
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.time_slots', 'time_slots')
        .where('task.user_id = :id', { id: 1 })
        .select([
          'task.id',
          'task.title',
          'task.description',
          'SUM(time_slots.duration) AS duration',
        ])

        .groupBy('task.id')
        // .groupBy('task.id, time_slots.start_time')
        // .select(['task.id'])
        // .groupBy('task.id, time_slots.start_time')
        .getMany()
    );

    //     return this.taskRepo
    // .createQueryBuilder('task')
    // .leftJoinAndSelect('task.time_slots', 'time_slot')
    // .where('task.user_id = :id', { id: 1 })
    // .groupBy('task.id, time_slot.start_time')
    // .getMany();

    // return this.taskRepo.findOneBy({ user_id: id });
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
