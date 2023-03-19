import { TaskController } from './tasks/tasks.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm/dist';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbOptions } from './db/data-source';
import { Task } from './tasks/task.entity';
import { TaskService } from './tasks/task.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...(dbOptions as TypeOrmModuleOptions),
    }),
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [AppController, TaskController],
  providers: [AppService, TaskService],
})
export class AppModule {}
