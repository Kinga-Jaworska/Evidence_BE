import { Param, Put } from '@nestjs/common/decorators';
import { TaskService } from './task.service';
import { Body, Controller, Get, Post, Injectable } from '@nestjs/common';
import { TimeSlotService } from 'src/time-slot/time-slot.service';
import { TaskDTO } from './dto/task.dto';
import { TaskEditTimeDTO } from './dto/task-edit-time.dto';

@Injectable()
@Controller('api/v1/tasks')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private timeSlotService: TimeSlotService,
  ) {}

  @Get()
  async getAll() {
    this.taskService.findAll();
  }

  @Post()
  async add(@Body() createTask: TaskDTO) {
    const task = await this.taskService.add(createTask);
    // console.log(createdTask);
    return this.timeSlotService.add({ task, ...createTask });
  }

  @Put(':id')
  async editTime(@Body() editTask: TaskEditTimeDTO, @Param('id') id: number) {
    const task = await this.taskService.findOne(id);
    console.log(task);
    return this.timeSlotService.add({ task, ...editTask });
  }

  @Put(':id')
  async edit(@Body() editTask: TaskEditTimeDTO, @Param('id') id: number) {
    const task = await this.taskService.findOne(id);
    console.log(task);
    return this.timeSlotService.add({ task, ...editTask });
  }
}
