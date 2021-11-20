import { IsNotEmpty, MinLength, IsEmail, IsBoolean } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  // @IsNotEmpty()
  // @MinLength(6)
  // readonly password: string;

  @IsNotEmpty()
  readonly phoneNumber: string;

  //@IsNotEmpty()
  //readonly properties: string; //Text;
}

export class loginDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(5)
  readonly password: string;
}

export class editUserDto {
  readonly name: string;

  readonly phoneNumber: string;
}
