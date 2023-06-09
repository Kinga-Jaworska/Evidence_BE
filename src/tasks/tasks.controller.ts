import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { Param, Put } from '@nestjs/common/decorators';
import { GetCurrentUserId } from 'src/common/decorators';
import { GoogleDriveService } from 'src/google-drive/google-drive.service';
import { TimeSlotService } from 'src/time-slot/time-slot.service';
import { EditTaskDTO } from './dto/task-edit.dto';
import { TaskDTO } from './dto/task.dto';
import { TaskService } from './task.service';

@Injectable()
@Controller('api/v1/tasks')
export class TaskController {
  constructor(
    private googleDriveService: GoogleDriveService,
    private taskService: TaskService,
    private timeSlotService: TimeSlotService,
  ) {}

  @Get(':id')
  async getUserTaskPerDates(@Param('id') userId: number) {
    // TODO: Passing user ID by @GetCurrentUser and month
    return await this.taskService.getAllTaskPerDate(userId);
  }

  @Post()
  async add(@Body() createTask: TaskDTO, @GetCurrentUserId() userId: number) {
    const task = await this.taskService.add(createTask);
    return this.timeSlotService.add({ task, ...createTask });
  }

  @Put(':slotID')
  async editTask(
    @Body() editTask: EditTaskDTO,
    @Param('slotID') slotID: number,
  ) {
    return await this.taskService.edit(editTask, slotID);
  }
}
