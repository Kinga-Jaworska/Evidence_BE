import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { CSVService } from 'src/csv/csv.service';
import { getMonthIndex } from 'src/csv/csv.utils';
import { TimeSlot } from 'src/time-slot/time-slot.entity';
import { Repository } from 'typeorm/repository/Repository';
import { CreateTaskDTO } from './dto/task-create.dto';
import { EditTaskDTO } from './dto/task-edit.dto';
import { Task } from './task.entity';
import { countDuration, setDateRange } from './task.utils';
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

  async getGroupedTasksPerUser(id: number, month: string) {
    let amountsPerDay = {};
    const { startDate, endDate } = setDateRange(month);

    const tasks = await this.taskRepo
      .createQueryBuilder('tasks')
      .innerJoin('tasks.time_slots', 'time_slots')
      .where('tasks.user_id = :id', { id })
      .andWhere('time_slots.start_time BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .select([
        'time_slots.start_time AS start_time',
        'tasks.title AS title',
        'tasks.description AS description',
        'time_slots.duration AS duration',
      ])
      .getRawMany()
      .then((results) => {
        /* 
        Create one object per each tasks title
          Example: 'Task new 5': { '01-09-2021': '100', '06-09-2021': '30' } 
        Create one object per each date with overall amount
          Example: { '01-09-2021': '100', '02-09-2021': '30' } 
        */
        return results.reduce((savedRow, record) => {
          const { title, start_time, duration, description } = record;
          const formattedDate = format(new Date(start_time), 'dd-MM-yyyy');

          if (!savedRow[title]) {
            savedRow[title] = {};
          }

          if (!amountsPerDay[formattedDate]) {
            amountsPerDay[formattedDate] = {};
          }

          savedRow[title]['description'] = description;

          savedRow[title][formattedDate] = countDuration(
            savedRow[title][formattedDate],
            duration,
          );

          amountsPerDay[formattedDate] = countDuration(
            amountsPerDay[formattedDate],
            duration,
          );

          return savedRow;
        }, {});
      });

    return this.csvService.generateCSV(
      tasks,
      amountsPerDay,
      getMonthIndex(startDate),
    );
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
        'tasks.description AS description',
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
