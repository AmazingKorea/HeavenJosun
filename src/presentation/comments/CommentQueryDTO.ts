import { IsInt } from 'class-validator';
import User from '../../domain/entities/User';

export default class CommentCreateOrUpdateDTO {
  id: number;

  author: User; // 이게 Join된 후 json으로 나갈 수 있을까?

  @IsInt()
  votes: number;

  content: string;

  createdAt: string;

  updatedAt: string;
}
