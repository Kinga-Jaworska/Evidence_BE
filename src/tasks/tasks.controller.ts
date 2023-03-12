import { TaskService } from './task.service';
import { Controller, Get } from '@nestjs/common';

@Controller('api/v1/tasks')
export class TaskController {
  constructor(private expensesService: TaskService) {}

  @Get()
  getAll() {
    this.expensesService.findAll();
  }
}
