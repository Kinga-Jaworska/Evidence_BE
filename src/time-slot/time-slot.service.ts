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
}
