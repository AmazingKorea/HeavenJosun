import { IsString } from 'class-validator';

export default class TagCreateOrUpdateDTO {
  @IsString()
  tagname: string;
}
