import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CSVService } from 'src/csv/csv.service';
import { TimeSlot } from 'src/time-slot/time-slot.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateTaskDTO } from './dto/task-create.dto';
import { EditTaskDTO } from './dto/task-edit.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(TimeSlot) private timeSlotRepo: Repository<TimeSlot>,
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

  async getGroupedTasksPerUser(id: number) {
    let amountsPerDay = {};
    const tasks = await this.taskRepo
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.time_slots', 'time_slots')
      .where('tasks.user_id = :id', { id })
      .select([
        'time_slots.start_time AS start_time',
        'tasks.title AS title',
        'SUM(time_slots.duration) AS duration',
      ])
      .groupBy('time_slots.start_time')
      .addGroupBy('tasks.title')
      .getRawMany()
      .then((results) => {
        /* 
        Create one object per each tasks title
          Example: 'Task new 5': { '01-09-2021': '100', '06-09-2021': '30' } 
        Create one object per each date with overall amount
          Example: { '01-09-2021': '100', '02-09-2021': '30' } 
        */
        return results.reduce((savedRow, record) => {
          const { title, start_time, duration } = record;

          if (!savedRow[title]) {
            savedRow[title] = {};
          }

          if (!amountsPerDay[start_time]) {
            amountsPerDay[start_time] = {};
          }

          savedRow[title][start_time] = duration;
          amountsPerDay[start_time] =
            (Number(amountsPerDay[start_time]) || 0) + Number(duration);

          return savedRow;
        }, {});
      });

    return this.csvService.generateCSV(tasks, amountsPerDay, 4);
  }

  async getAllTaskPerDate(id: number) {
    // Returning task for user per each date
    // Example: [{'20-05-2023'}: Task[],{'21-05-2023'}: Task[]]
    const tasks = await this.taskRepo
      .createQueryBuilder('tasks')
      .innerJoin('tasks.time_slots', 'time_slots')
      .where('tasks.user_id = :id', { id })
      .select([
        'time_slots.start_time AS start_time',
        'time_slots.id AS slot_id',
        'tasks.title AS title',
        'tasks.id AS id',
        'duration',
      ])
      .getRawMany()
      .then((results) => {
        return results.reduce((savedTask, task) => {
          const { title } = task;

          if (!savedTask[title]) {
            savedTask[title] = [];
          }

          savedTask[title] = [task, ...savedTask[title]];

          return savedTask;
        }, {});
      });

    return tasks;
  }

  async edit(editTask: EditTaskDTO, slotID: number) {
    const { title, description, ...slot } = editTask;
    const { task, ...timeSlot } = await this.timeSlotRepo.findOne({
      where: {
        id: slotID,
      },
      relations: ['task'],
    });

    const newTimeSlot = { ...timeSlot, ...slot };

    const newTask = {
      ...task,
      ...(title && { title }),
      ...(description && { description }),
    };

    return await Promise.all([
      this.taskRepo.save({ ...newTask }),
      this.timeSlotRepo.save({ ...newTimeSlot }),
    ]);
  }
}
