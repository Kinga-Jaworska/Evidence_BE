import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CSVService } from 'src/csv/csv.service';
import { TimeSlot } from 'src/time-slot/time-slot.entity';
import { TimeSlotService } from 'src/time-slot/time-slot.service';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TimeSlot])],
  controllers: [TaskController],
  providers: [TaskService, TimeSlotService, CSVService],
})
export class TaskModule {}
