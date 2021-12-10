import { IsString } from 'class-validator';

export default class FeedUpdateVoteDTO {
  @IsString() // Json body 아니면 IsInt 불가
  delta: string;
}
