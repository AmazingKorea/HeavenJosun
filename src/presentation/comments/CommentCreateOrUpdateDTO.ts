import { IsString } from 'class-validator';

export default class CommentCreateOrUpdateDTO {
  @IsString()
  content: string;

  @IsString() // Json body 아니면 IsInt 불가
  feed_id: string;
}
