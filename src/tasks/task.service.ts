import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CSVService } from 'src/csv/csv.service';
import { Repository } from 'typeorm/repository/Repository';
import { CreateTaskDTO } from './dto/task-create.dto';
import { EditTaskDTO } from './dto/task-edit.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    private csvService: CSVService,
  ) {}

  findAll() {
    return this.taskRepo.find();
  }

  findOne(id: number) {
    return this.taskRepo.findOneBy({ id });
  }

  add(task: CreateTaskDTO) {
    return this.taskRepo.save(task);
  }

  async getsumForEachDay(id: number) {
    return await this.taskRepo
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.time_slots', 'time_slots')
      .where('tasks.user_id = :id', { id })
      .select([
        'time_slots.start_time AS start_time',
        'SUM(time_slots.duration) AS duration',
      ])
      .groupBy('time_slots.start_time')
      .getRawMany()
      .then((results) => {
        /* Create key value obj for each date (key-date, value-sumOfDuration)
        Example: '01-09-2021': '100' */

        const formattedResults = [];
        results.forEach(({ start_time, duration }) => {
          formattedResults[start_time] = duration;
        });

        return formattedResults;
      });
  }

  async getGroupedTasksForUser(id: number) {
    const tasks = await this.taskRepo
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.time_slots', 'time_slots')
      .where('tasks.user_id = :id', { id })
      .select([
        'tasks.title AS title',
        'time_slots.start_time AS start_time',
        'SUM(time_slots.duration) AS duration',
      ])
      .groupBy('tasks.title')
      .addGroupBy('time_slots.start_time')
      .getRawMany()
      .then((results) => {
        /* Create one object per each tasks title
        Example: 'Task new 5': { '01-09-2021': '100', '06-09-2021': '30' } */

        return results.reduce((savedRow, record) => {
          const { title, start_time, duration } = record;
          if (!savedRow[title]) {
            savedRow[title] = {};
          }
          savedRow[title][start_time] = duration;

          return savedRow;
        }, {});
      });

    const sums = await this.getsumForEachDay(id);
    this.csvService.generateCSV(tasks, sums, 4);

    return tasks;
  }

  async edit(task: EditTaskDTO, id: number) {
    const foundTask = await this.taskRepo.findOneBy({ id });
    return this.taskRepo.save({ ...foundTask, ...task });
  }
}
