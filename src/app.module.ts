import { TaskController } from './tasks/tasks.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm/dist';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbOptions } from './db/data-source';
import { Task } from './tasks/task.entity';
import { TaskService } from './tasks/task.service';
import { TimeSlot } from './time-slot/time-slot.entity';
import { TimeSlotService } from './time-slot/time-slot.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(dbOptions as TypeOrmModuleOptions),
    }),
    TypeOrmModule.forFeature([Task, TimeSlot]),
  ],
  controllers: [AppController, TaskController],
  providers: [AppService, TaskService, TimeSlotService],
})
export class AppModule {}
