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
import { TimeSlotController } from './time-slot/time-slot.controller';
import { UserController } from './users/users.controller';
import { UserService } from './users/user.service';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(dbOptions as TypeOrmModuleOptions),
    }),
    TypeOrmModule.forFeature([Task, User, TimeSlot]),
  ],
  controllers: [
    AppController,
    TaskController,
    TimeSlotController,
    UserController,
  ],
  providers: [AppService, TaskService, TimeSlotService, UserService],
})
export class AppModule {}
