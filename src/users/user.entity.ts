import { IsEmail } from 'class-validator';
import { Task } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  refresh_token: string;

  @Column()
  password: string;

  @Column()
  @IsEmail()
  email: string;

  @OneToMany(() => Task, (tasks) => tasks.user_id)
  tasks: Task[];
}
