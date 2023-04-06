import { Optional } from '@nestjs/common';

export class TaskEditTimeDTO {
  @Optional()
  start_time: string;

  @Optional()
  end_time: string;

  @Optional()
  duration: number;
}
