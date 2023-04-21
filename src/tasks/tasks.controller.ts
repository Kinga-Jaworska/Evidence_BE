import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { Param, Patch, Put } from '@nestjs/common/decorators';
import { TimeSlotService } from 'src/time-slot/time-slot.service';
import { TaskEditTimeDTO } from './dto/task-edit-time.dto';
import { EditTaskDTO } from './dto/task-edit.dto';
import { TaskDTO } from './dto/task.dto';
import { TaskService } from './task.service';

@Injectable()
@Controller('api/v1/tasks')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private timeSlotService: TimeSlotService,
  ) {}

  @Get()
  async getAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  async getSelectedUserTasks(@Param('id') id: number) {
    return this.taskService.getGroupedTasksPerUser(id);
  }

  @Post()
  async add(@Body() createTask: TaskDTO) {
    const task = await this.taskService.add(createTask);
    return this.timeSlotService.add({ task, ...createTask });
  }

  @Put(':id')
  async editTime(@Body() editTask: TaskEditTimeDTO, @Param('id') id: number) {
    const task = await this.taskService.findOne(id);
    return this.timeSlotService.add({ task, ...editTask });
  }

  @Patch(':id')
  async edit(@Body() editTask: EditTaskDTO, @Param('id') id: number) {
    return this.taskService.edit(editTask, id);
  }
}
