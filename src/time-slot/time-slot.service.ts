import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateTimeSlotDTO } from './dto/time-slot-create.dto';
import { EditTimeSlotDTO } from './dto/time-slot-edit.dto';
import { TimeSlot } from './time-slot.entity';

@Injectable()
export class TimeSlotService {
  constructor(
    @InjectRepository(TimeSlot) private timeSlotRepo: Repository<TimeSlot>,
  ) {}

  async findAll() {
    return this.timeSlotRepo.find();
  }

  add(timeSlot: CreateTimeSlotDTO) {
    return this.timeSlotRepo.save(timeSlot);
  }

  findOne(id: number) {
    return this.timeSlotRepo.findOneBy({ id });
  }

  async edit(timeSlot: EditTimeSlotDTO, id: number) {
    const foundTimeSlot = await this.timeSlotRepo.findOneBy({ id });
    return this.timeSlotRepo.save({ ...foundTimeSlot, ...timeSlot });
  }
  async getTaskPerDate() {
    console.log(
      // await this.timeSlotRepo
      //   .createQueryBuilder()
      //   .select('start_time')
      //   // .addSelect('start_time')
      //   .addSelect('COUNT(*) as count')
      //   .where('task_id = :taskId', { taskId: 2 })
      //   .groupBy('id')
      //   .addGroupBy('start_time')
      //   .getRawMany(),
      await this.timeSlotRepo
        .createQueryBuilder('time_slot')
        .leftJoinAndSelect('time_slot.task', 'tasks')
        .groupBy('tasks.id')
        .select([
          'task.id as task_id',
          'GROUP_CONCAT(time_slot.id) as time_slots',
        ])
        .getRawMany(),
    );
    // await this.timeSlotRepo
    //   .createQueryBuilder()
    //   .select('id')
    //   .addSelect('start_time')
    //   .addSelect('COUNT(*) as count')
    //   .where('task_id = :taskId', { taskId: 2 })
    //   // .where('start_time = :start', { start: '12-08-2023' })
    //   .groupBy('id')
    //   .addGroupBy('start_time')
    //   .groupBy('start_time')
    //   .getRawMany(),

    // await this.createQueryBuilder()
    // .select('id')
    // .addSelect('start_time')
    // .addSelect('COUNT(*) as count')
    // .where('task_id = :taskId', { taskId })
    // .groupBy('id')
    // .addGroupBy('start_time')
    // .getRawMany();

    return 0;
  }
}
