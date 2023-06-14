import { Task } from 'src/tasks/task.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('time_slots')
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  start_time: Date;

  @Column()
  duration: number;

  @ManyToOne(() => Task, (task: Task) => task.time_slots)
  @JoinColumn({ name: 'task_id' })
  task: Task;
}
