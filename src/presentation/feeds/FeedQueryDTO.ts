import User from '../../domain/entities/User';

export default class FeedCreateOrUpdateDTO {
  id: number;

  author: User; // 이게 Join된 후 json으로 나갈 수 있을까?

  votes: number;

  title: string;

  body: string;

  createdAt: string;

  updatedAt: string;
}
