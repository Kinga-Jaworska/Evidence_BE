import { Module } from '@nestjs/common';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlot } from './time-slot.entity';
import { TimeSlotService } from './time-slot.service';

@Module({
  imports: [TimeSlot],
  controllers: [TimeSlotController],
  providers: [TimeSlotService],
})
export class TaskModule {}
