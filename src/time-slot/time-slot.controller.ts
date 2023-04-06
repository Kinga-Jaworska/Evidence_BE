import { Param, Put } from '@nestjs/common/decorators';

import { Body, Controller, Get, Injectable } from '@nestjs/common';
import { TimeSlotService } from 'src/time-slot/time-slot.service';

import { EditTimeSlotDTO } from './dto/time-slot-edit.dto';

@Injectable()
@Controller('api/v1/time_slot')
export class TimeSlotController {
  constructor(private timeSlotService: TimeSlotService) {}

  @Get()
  async getAll() {
    this.timeSlotService.findAll();
  }

  @Put(':id')
  async editTime(
    @Body() editTimeSlot: EditTimeSlotDTO,
    @Param('id') id: number,
  ) {
    return this.timeSlotService.edit(editTimeSlot, id);
  }
}
