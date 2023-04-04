import { IsString, IsOptional } from 'class-validator';

export class EditTaskDTO {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
