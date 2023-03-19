import { CreateTaskDTO } from './dto/task-create.dto';
import { TaskService } from './task.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('api/v1/tasks')
export class TaskController {
  constructor(private expensesService: TaskService) {}

  @Get()
  async getAll() {
    this.expensesService.findAll();
  }

  @Post()
  async add(@Body() createTask: CreateTaskDTO) {
    return this.expensesService.add(createTask);
  }
}
