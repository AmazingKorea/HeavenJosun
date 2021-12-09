import { IsString } from 'class-validator';

export default class CommentCreateOrUpdateDTO {
  @IsString()
  content: string;
}
