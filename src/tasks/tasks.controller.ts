import { Param, Patch, Put } from '@nestjs/common/decorators';
import { TaskService } from './task.service';
import { Body, Controller, Get, Post, Injectable } from '@nestjs/common';
import { TimeSlotService } from 'src/time-slot/time-slot.service';
import { TaskDTO } from './dto/task.dto';
import { TaskEditTimeDTO } from './dto/task-edit-time.dto';
import { EditTaskDTO } from './dto/task-edit.dto';

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

  @Get(':id')
  async getSelectedUserTasks(@Param('id') id) {
    return this.taskService.findPerUser(id);
  }

  @Post()
  async add(@Body() createTask: TaskDTO) {
    const task = await this.taskService.add(createTask);
    return this.timeSlotService.add({ task, ...createTask });
  }

  @Put(':id')
  async editTime(@Body() editTask: TaskEditTimeDTO, @Param('id') id: number) {
    const task = await this.taskService.findOne(id);
    console.log(task);
    return this.timeSlotService.add({ task, ...editTask });
  }

  @Patch(':id')
  async edit(@Body() editTask: EditTaskDTO, @Param('id') id: number) {
    return this.taskService.edit(editTask, id);
  }
}
