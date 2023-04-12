import { TimeSlot } from 'src/time-slot/time-slot.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column()
  user_id: number;

  @OneToMany(() => TimeSlot, (time_slot) => time_slot.task)
  time_slots: TimeSlot[];
}
