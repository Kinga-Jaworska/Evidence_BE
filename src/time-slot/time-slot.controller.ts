import { Body, Delete, Param, Put } from '@nestjs/common/decorators';

import { Controller, Get, Injectable } from '@nestjs/common';
import { TaskService } from 'src/tasks/task.service';
import { TimeSlotService } from 'src/time-slot/time-slot.service';
import { CreateTimeSlotDTO } from './dto/time-slot-create.dto';

@Injectable()
@Controller('api/v1/time_slots')
export class TimeSlotController {
  constructor(
    private timeSlotService: TimeSlotService,
    private taskRepo: TaskService,
  ) {}

  @Get()
  async getAll() {
    return this.timeSlotService.findAll();
  }

  @Delete(':slotID')
  async delete(@Param('slotID') slotID: number) {
    return await this.timeSlotService.delete(slotID);
  }

  @Put()
  async addTimeSlot(@Body() addTime: CreateTimeSlotDTO) {
    return this.timeSlotService.add(addTime);
  }
}
