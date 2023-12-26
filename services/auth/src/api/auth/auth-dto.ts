import {
  IsEmail,
  IsInt,
  IsPhoneNumber,
  IsString,
  Length,
  isEmail,
  isStrongPassword,
} from 'class-validator';

export class LoginEmailDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
