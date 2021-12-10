import { Service } from 'typedi';
import Comment from '../domain/entities/Comment.js';
import User from '../domain/entities/User.js';
import CommentRepository from '../domain/repositories/CommentRepository.js';
import FeedRepository from '../domain/repositories/FeedRepository.js';
import CommentCreateOrUpdateDTO from '../presentation/comments/CommentCreateOrUpdateDTO.js';
import CommentUpdateVoteDTO from '../presentation/comments/CommentUpdateVoteDTO.js';

@Service()
class CommentService {
  private commentRepository: CommentRepository;
  private feedRepository: FeedRepository;

  constructor(commentRepository: CommentRepository, feedRepository: FeedRepository) {
    this.commentRepository = commentRepository;
    this.feedRepository = feedRepository;
  }

  async createComment(owner: User, commentDto: CommentCreateOrUpdateDTO): Promise<Comment> {
    const { content, feed_id: feedId } = commentDto;
    const feed = await this.feedRepository.getFeedById(Number.parseInt(feedId));
    const comment = new Comment(owner, feed, content);
    return await this.commentRepository.createComment(comment);
  }

  async getCommentsByFeedId(id: number): Promise<Array<Comment>> {
    const comments = await this.commentRepository.getCommentByFeedId(id);
    return comments;
  }

  async getCommentById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.getCommentById(id);
    console.log('found:', comment);
    return comment;
  }

  async getCommentsCountByFeedId(feedId: number): Promise<number> {
    return await this.commentRepository.getCommentsCountByFeedId(feedId);
  }

  async updateComment(id: number, updateDTO: CommentCreateOrUpdateDTO): Promise<Comment> {
    const toUpdate = await this.commentRepository.getCommentById(id);
    if (!toUpdate) {
      throw new Error(`id=${id}에 대응되는 comment가 없습니다.`);
    }
    toUpdate.updateContent(updateDTO.content);
    return await this.commentRepository.updateComment(toUpdate);
  }

  async updateVoteCount(id: number, updateDTO: CommentUpdateVoteDTO): Promise<Comment> {
    const comment = await this.commentRepository.getCommentById(id);
    const { delta: delta } = updateDTO;
    comment.updateVoteCount(Number.parseInt(delta));
    await this.commentRepository.updateComment(comment);
    return comment;
  }

  async deleteCommentById(id: number): Promise<boolean> {
    try {
      return await this.commentRepository.deleteCommentById(id);
    } catch (e) {
      throw new Error(`Comment ID=${id} 삭제 중 오류가 발생했습니다.`);
    }
  }
}

export default CommentService;
