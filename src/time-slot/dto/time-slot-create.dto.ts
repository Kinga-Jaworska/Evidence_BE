import { Task } from 'src/tasks/task.entity';

export class CreateTimeSlotDTO {
  task: Task;
  start_time: string;
  end_time: string;
  duration: number;
}
