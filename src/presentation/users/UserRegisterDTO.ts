import { IsString } from 'class-validator';

export default class UserRegisterDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  name: string;
}
