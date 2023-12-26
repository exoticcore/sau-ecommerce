import { IsEmail, IsString } from 'class-validator';

export class SignupUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

export class PasswordDTO {
  @IsString()
  password: string;
}
