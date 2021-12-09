import { Service } from 'typedi';
import Comment from '../domain/entities/Comment.js';
import Feed from '../domain/entities/Feed.js';
import User from '../domain/entities/User.js';
import CommentRepository from '../domain/repositories/CommentRepository.js';
import CommentCreateOrUpdateDTO from '../presentation/comments/CommentCreateOrUpdateDTO.js';

@Service()
class CommentService {
  private commentRepository: CommentRepository;

  constructor(commentRepository: CommentRepository) {
    this.commentRepository = commentRepository;
  }

  async createComment(owner: User, comment: Comment): Promise<Comment> {
    await this.commentRepository.createComment(owner, comment);
    return comment;
  }

  async getCommentByFeedId(id: number): Promise<Array<Comment>> {
    const comments = await this.commentRepository.getCommentByFeedId(id);
    console.log('found:', comments);
    return comments;
  }

  async getCommentById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.getCommentById(id);
    console.log('found:', comment);
    return comment;
  }

  async updateComment(id: number, updateDTO: CommentCreateOrUpdateDTO): Promise<Comment> {
    const toUpdate = await this.commentRepository.getCommentById(id);
    if (!toUpdate) {
      throw new Error(`id=${id}에 대응되는 comment가 없습니다.`);
    }
    toUpdate.updateContent(updateDTO.content);
    return await this.commentRepository.updateComment(toUpdate);
  }

  async updateVoteCount(id: number, delta: number): Promise<void> {
    const comment = await this.commentRepository.getCommentById(id);
    comment.updateVoteCount(delta);
    await this.commentRepository.updateComment(comment);
  }

  async deleteCommentById(id: number): Promise<boolean> {
    try {
      return await this.commentRepository.deleteCommentById(id);
    } catch (e) {
      // 얘만 예외처리한 이유? 글쎄.
      throw new Error(`Comment ID=${id} 삭제 중 오류가 발생했습니다.`);
    }
  }
}

export default CommentService;
