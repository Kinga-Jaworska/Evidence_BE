import { Optional } from '@nestjs/common';
// import { IsNotEmpty, IsNumber } from 'class-validator';

export class TaskEditTimeDTO {
  @Optional()
  start_time: string;

  @Optional()
  end_time: string;

  @Optional()
  duration: number;
}
