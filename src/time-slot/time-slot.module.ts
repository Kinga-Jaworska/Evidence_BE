import { Module } from '@nestjs/common';
import { TimeSlot } from './time-slot.entity';
import { TimeSlotService } from './time-slot.service';

@Module({
  imports: [TimeSlot],
  providers: [TimeSlotService],
})
export class TaskModule {}
