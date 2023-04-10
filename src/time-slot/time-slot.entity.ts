import { Task } from 'src/tasks/task.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  start_time: string;

  @Column({ type: 'varchar', length: 255 })
  end_time: string;

  @Column()
  duration: number;

  @ManyToOne(() => Task, (task: Task) => task.time_slots)
  @JoinColumn({ name: 'task_id' })
  task: Task;
}
