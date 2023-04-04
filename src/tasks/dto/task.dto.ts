import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class TaskDTO {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  start_time: string;

  @IsNotEmpty()
  end_time: string;

  @IsNumber()
  duration: number;
}
