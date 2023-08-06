import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Task } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'numeric' })
  @IsNotEmpty()
  id: number;

  @Column({ nullable: true })
  refresh_token: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  username: string;

  @OneToMany(() => Task, (tasks) => tasks.user_id)
  tasks: Task[];
}
