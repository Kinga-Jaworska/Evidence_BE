import { IsNotEmpty, IsNumber } from 'class-validator';

export class TaskEditTimeDTO {
  @IsNotEmpty()
  start_time: string;

  @IsNotEmpty()
  end_time: string;

  @IsNumber()
  duration: number;
}
