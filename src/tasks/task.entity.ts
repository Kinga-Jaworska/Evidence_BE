import { TimeSlot } from 'src/time-slot/time-slot.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  project_name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column()
  user_id: number;

  @OneToMany(() => TimeSlot, (time_slot) => time_slot.task)
  time_slots: TimeSlot[];

  @ManyToOne(() => User, (user) => user.tasks) // Define the Many-to-One relationship with User entity
  @JoinColumn({ name: 'user_id' }) // Specify the join column
  user: User; // Add the user property
}
