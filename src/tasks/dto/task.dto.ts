import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TaskDTO {
  @IsString()
  project_name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  start_time: string;

  @IsNumber()
  duration: number;
}
