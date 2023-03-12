import { Module } from '@nestjs/common';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './tasks.controller';

@Module({
  imports: [Task],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
