import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createObjectCsvWriter } from 'csv-writer';
import { Repository } from 'typeorm/repository/Repository';
import { CreateTaskDTO } from './dto/task-create.dto';
import { EditTaskDTO } from './dto/task-edit.dto';
import { Task } from './task.entity';

interface CSVData {
  tasks_title: string;
  time_slots_start_time: string;
  duration: string;
}

interface CVSsumsData {
  start_time: string;
}

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepo: Repository<Task>) {}

  findAll() {
    return this.taskRepo.find();
  }

  getDatesArray(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().substring(0, 10));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  testCSV = async (data: CSVData[], sums: CVSsumsData[]) => {
    const start = new Date('2021-09-01');
    const end = new Date('2021-09-30');
    const dates = [];

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      const dateToFormat = new Date(date);
      const yyyy = dateToFormat.getFullYear();
      let mm = (dateToFormat.getMonth() + 1).toString(); // Months start at 0!
      let dd = dateToFormat.getDate().toString();

      if (+dd < 10) dd = '0' + dd;
      if (+mm < 10) mm = '0' + mm;

      const formattedToday = dd + '-' + mm + '-' + yyyy;
      dates.push(formattedToday);
    }

    // Create one object per each tasks title
    // Structure like this:
    // title1: { date_1: duration, date_2: duration }
    // Example: 'Task new 5': { '01-09-2021': '100', '06-09-2021': '30' },

    let table = data.reduce((savedRow, record) => {
      const { tasks_title, time_slots_start_time, duration } = record;
      if (!savedRow[tasks_title]) {
        savedRow[tasks_title] = {};
      }
      savedRow[tasks_title][time_slots_start_time] = duration;

      return savedRow;
    }, {});

    // add to data this sum query?

    let rowsum = { sum: {} };
    table = { ...table, ...rowsum };

    // Create rows per each task
    // Structure:

    let rows = Object.keys(table).map((task_title) => {
      const time_slots = table[task_title];
      const row = { task_title };

      dates.forEach((date) => {
        row[date] = time_slots[date] ? `${time_slots[date]}` : '';
        if (task_title === 'sum') row[date] = sums[date];
      });

      return row;
    });

    const csvWriter = createObjectCsvWriter({
      path: 'data.csv',
      header: [
        { id: 'task_title', title: 'Title' }, // id: task_title -> assigned to ID of task_title prop
        ...dates.map((date) => ({
          id: date,
          title: date,
        })),
      ],
    });

    csvWriter.writeRecords(rows);
  };

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
        const formattedResults = [];

        results.forEach((result) => {
          const startTime = result.start_time;
          const duration = result.duration;
          formattedResults[startTime] = duration;
        });
        console.log(formattedResults);
        return formattedResults;
      });
  }

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

    const sums = await this.getsumForEachDay(id);
    this.testCSV(tasks, sums);

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
