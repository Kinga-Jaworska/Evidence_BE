import { TaskService } from './task.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './tasks.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TimeSlotService } from 'src/time-slot/time-slot.service';
import { TimeSlot } from 'src/time-slot/time-slot.entity';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskService: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TimeSlotService,
        {
          provide: getRepositoryToken(TimeSlot),
          useClass: Repository,
        },
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
      ],
    }).compile();

    taskService = module.get(TaskService);
    mockTaskService = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('Should be defined', async () => {
    expect(taskService).toBeDefined();
  });

  it('Repo should be defined', async () => {
    expect(mockTaskService).toBeDefined();
  });
});
