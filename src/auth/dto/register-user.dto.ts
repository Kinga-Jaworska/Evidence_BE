import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  username: string;
}
