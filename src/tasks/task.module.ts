import { Module } from '@nestjs/common';
import { TimeSlotService } from 'src/time-slot/time-slot.service';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './tasks.controller';

@Module({
  imports: [Task],
  controllers: [TaskController],
  providers: [TaskService, TimeSlotService],
})
export class TaskModule {}
