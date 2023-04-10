import { Task } from 'src/tasks/task.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Task, (tasks) => tasks.user_id)
  tasks: Task[];
}
