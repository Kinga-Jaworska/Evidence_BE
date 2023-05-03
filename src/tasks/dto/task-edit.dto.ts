import { IsOptional } from 'class-validator';

export class EditTaskDTO {
  @IsOptional()
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  start_time: string;

  @IsOptional()
  end_time: string;

  @IsOptional()
  duration: number;
}
