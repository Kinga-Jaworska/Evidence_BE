import { Test, TestingModule } from '@nestjs/testing';

import { TaskService } from './task.service';
import { TimeSlotService } from 'src/time-slot/time-slot.service';
import { TaskDTO } from './dto/task.dto';
import { TaskEditTimeDTO } from './dto/task-edit-time.dto';
import { EditTaskDTO } from './dto/task-edit.dto';
import { TaskController } from './tasks.controller';

describe('TaskController', () => {
  let controller: TaskController;
  let taskService: TaskService;
  let timeSlotService: TimeSlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService, TimeSlotService],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
    timeSlotService = module.get<TimeSlotService>(TimeSlotService);
  });

  describe('getAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
      ];

      jest.spyOn(taskService, 'findAll').mockResolvedValue(tasks);

      expect(await controller.getAll()).toBe(tasks);
      expect(taskService.findAll).toHaveBeenCalled();
    });
  });

  describe('add', () => {
    it('should create a new task and time slot', async () => {
      const createTask: TaskDTO = {
        title: 'New Task',
        start_time: `${new Date()}`,
        end_time: `${new Date()}`,
        description: '',
        duration: 23,
      };
      const timeSlot = {
        id: 1,
        start_time: `${new Date()}`,
        end_time: `${new Date()}`,
        time_slots: { id: 1, title: 'New Task' },
        description: '',
        duration: 23,
      };

      const task = { id: 1, title: 'New Task', tasks: [timeSlot] };

      jest.spyOn(taskService, 'add').mockResolvedValue(task);
      jest.spyOn(timeSlotService, 'add').mockResolvedValue(timeSlot);

      expect(await controller.add(createTask)).toEqual(timeSlot);
      expect(taskService.add).toHaveBeenCalledWith(createTask);
      expect(timeSlotService.add).toHaveBeenCalledWith({ task, ...createTask });
    });
  });

  describe('editTime', () => {
    it('should edit the task and create a new time slot', async () => {
      const editTask: TaskEditTimeDTO = {
        start_time: `${new Date()}`,
        endTime: `${new Date()}`,
      };
      const id = 1;
      const task = { id, title: 'Task 1' };
      const timeSlot = {
        id: 1,
        start_time: `${new Date()}`,
        endTime: `${new Date()}`,
        task,
      };
      jest.spyOn(taskService, 'findOne').mockResolvedValue(task);
      jest.spyOn(timeSlotService, 'add').mockResolvedValue(timeSlot);

      expect(await controller.editTime(editTask, id)).toEqual(timeSlot);
      expect(taskService.findOne).toHaveBeenCalledWith(id);
      expect(timeSlotService.add).toHaveBeenCalledWith({ task, ...editTask });
    });
  });

  describe('edit', () => {
    it('should edit the task', async () => {
      const editTask: EditTaskDTO = { title: 'Edited Task' };
      const id = 1;
      jest.spyOn(taskService, 'edit').mockResolvedValue(undefined);

      expect(await controller.edit(editTask, id)).toBeUndefined();
      expect(taskService.edit).toHaveBeenCalledWith(editTask, id);
    });
  });
});
