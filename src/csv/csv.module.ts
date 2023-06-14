import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';
import { TimeSlot } from 'src/time-slot/time-slot.entity';
import { CSVService } from './csv.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TimeSlot])],
  controllers: [],
  providers: [CSVService],
})
export class CSVModule {}
