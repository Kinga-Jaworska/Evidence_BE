import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDTO {
  @IsNotEmpty()
  id: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  username: string;
}
