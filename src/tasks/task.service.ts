import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createObjectCsvWriter } from 'csv-writer';
import { Repository } from 'typeorm/repository/Repository';
import { CreateTaskDTO } from './dto/task-create.dto';
import { EditTaskDTO } from './dto/task-edit.dto';
import { Task } from './task.entity';

interface CSVData {
  title: string;
  start_time: string;
  duration: string;
}

interface CSVSumData {
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

  formatDate(dateToFormat: Date) {
    const date = new Date(dateToFormat);

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const formattedDate = `${day.toString().padStart(2, '0')}-${month
      .toString()
      .padStart(2, '0')}-${year}`;
    return formattedDate;
  }

  generateCSV = async (data: CSVData[], sums: CSVSumData[]) => {
    const start = new Date('2021-09-01');
    const end = new Date('2021-09-30');
    const dates = [];

    for (
      let date = start;
      date <= end;
      date.setDate(date.getDate() + 1) // TODO: make this for every month
    ) {
      dates.push(this.formatDate(date));
    }

    let rowsum = { sum: {} };
    data = { ...data, ...rowsum };

    // Create rows per each task
    let overall_amount = 0;
    let rows = Object.keys(data).map((title) => {
      const time_slots = data[title];
      const row = { title };
      let task_amount = 0;

      dates.forEach((date) => {
        row[date] = time_slots[date] ? `${time_slots[date]}` : '';
        task_amount += Number(time_slots[date]) || 0;

        row['task_amount'] = task_amount;

        if (title === 'sum') {
          row[date] = sums[date];
          row['task_amount'] = overall_amount;
        }
      });

      overall_amount += task_amount;
      return row;
    });

    const csvWriter = createObjectCsvWriter({
      path: 'data.csv',
      header: [
        { id: 'title', title: 'Title' },
        ...dates.map((date) => ({
          id: date,
          title: date,
        })),
        { id: 'task_amount', title: 'Amount per task row' },
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
        // Create key value obj for each date (key-date, value-sumOfDuration)
        // Example: '01-09-2021': '100'
        const formattedResults = [];
        results.forEach(({ start_time, duration }) => {
          formattedResults[start_time] = duration;
        });

        return formattedResults;
      });
  }

  async findPerUser(id: number) {
    const tasks = await this.taskRepo
      .createQueryBuilder('tasks')
      .leftJoinAndSelect('tasks.time_slots', 'time_slots')
      .where('tasks.user_id = :id', { id })
      .select([
        'tasks.title as title',
        'time_slots.start_time AS start_time',
        'SUM(time_slots.duration) AS duration',
      ])
      .groupBy('tasks.title')
      .addGroupBy('time_slots.start_time')
      .getRawMany()
      .then((results) => {
        // Create one object per each tasks title
        // Example: 'Task new 5': { '01-09-2021': '100', '06-09-2021': '30' }

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
    this.generateCSV(tasks, sums);

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
