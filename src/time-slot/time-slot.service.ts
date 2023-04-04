import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreateTimeSlotDTO } from './dto/time-slot-create.dto';
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
}
