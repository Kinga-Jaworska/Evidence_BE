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

const fs = require('fs');
const { google } = require('googleapis');

const GOOGLE_API_FOLDER_ID = '1vTbCvjSk2oMjCDCDrxdVFUCB2UOMlQYJ';

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

  async getOverall() {
    const { startDate, endDate } = setDateRange('czerwiec');
    console.log('startDate', startDate);

    // USER_NAME: { 'PROJECT_NAME': 'added_amount_for_this_user', 'PROJECT_NAME_2': 'added_amount' }
    // TASK NAME - PROJECT but now im dont have project table
    // AMOUNT for month -> grouped by project and per user
    // month grouped by user and then by project
    const tasks = await this.taskRepo
      .createQueryBuilder('tasks')
      .innerJoin('tasks.time_slots', 'time_slots')
      .innerJoin('tasks.user', 'user') // Update the join to use tasks.user
      .andWhere('time_slots.start_time BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .select([
        'time_slots.start_time AS start_time',
        'tasks.project_name AS project_name',
        'tasks.description AS description',
        'time_slots.duration AS duration',
        'user.username AS username',
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
          const { project_name, duration, username } = record;

          if (!savedRow[username]) {
            savedRow[username] = {};
          }

          if (!savedRow[username][project_name]) {
            savedRow[username][project_name] = 0;
          }

          savedRow[username][project_name] += duration;

          return savedRow;
        }, {});
      });

    const file = this.csvService.generateOverallCSV(tasks);
    return file;
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
        'tasks.project_name AS project_name',
        'tasks.description AS description',
        'time_slots.duration AS duration',
      ])
      .getRawMany()
      .then((results) => {
        /* 
        Create one object per each tasks project_name
          Example: 'Task new 5': { '01-09-2021': '100', '06-09-2021': '30' } 
        Create one object per each date with overall amount
          Example: { '01-09-2021': '100', '02-09-2021': '30' } 
        */
        return results.reduce((savedRow, record) => {
          const { project_name, start_time, duration, description } = record;
          const formattedDate = format(new Date(start_time), 'dd-MM-yyyy');

          if (!savedRow[project_name]) {
            savedRow[project_name] = {};
          }

          if (!amountsPerDay[formattedDate]) {
            amountsPerDay[formattedDate] = {};
          }

          savedRow[project_name]['description'] = description;

          savedRow[project_name][formattedDate] = countDuration(
            savedRow[project_name][formattedDate],
            duration,
          );

          amountsPerDay[formattedDate] = countDuration(
            amountsPerDay[formattedDate],
            duration,
          );

          return savedRow;
        }, {});
      });

    const file = this.csvService.generateCSV(
      tasks,
      amountsPerDay,
      getMonthIndex(startDate),
    );

    return file;
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
        'tasks.project_name AS project_name',
        'tasks.id AS id',
        'duration',
      ])
      .getRawMany()
      .then((results) => {
        return results.reduce((savedTask, task) => {
          const { project_name } = task;

          if (!savedTask[project_name]) {
            savedTask[project_name] = [];
          }
          savedTask[project_name] = [task, ...savedTask[project_name]];

          return savedTask;
        }, {});
      });

    return tasks;
  }

  async edit(editTask: EditTaskDTO, slotID: number) {
    const { project_name, description, ...slot } = editTask;
    const { task, ...timeSlot } = await this.timeSlotRepo.findOne({
      where: {
        id: slotID,
      },
      relations: ['task'],
    });

    const newTimeSlot = { ...timeSlot, ...slot };

    const newTask = {
      ...task,
      ...(project_name && { project_name }),
      ...(description && { description }),
    };

    return await Promise.all([
      this.taskRepo.save({ ...newTask }),
      this.timeSlotRepo.save({ ...newTimeSlot }),
    ]);
  }
}
