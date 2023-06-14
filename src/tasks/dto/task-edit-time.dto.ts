import { Optional } from '@nestjs/common';

export class TaskAddTime {
  @Optional()
  start_time: string;

  @Optional()
  duration: number;
}
