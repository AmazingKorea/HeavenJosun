import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import Comment from '../entities/Comment.js';

class CommentRepository {
  private repo: EntityRepository<Comment>;

  constructor(orm: MikroORM) {
    this.repo = orm.em.getRepository(Comment);
  }

  async createComment(comment: Comment): Promise<Comment> {
    const toCreate = this.repo.create(comment);
    console.log('toCreate:', toCreate);
    await this.repo.persist(toCreate).flush();
    return toCreate;
  }

  async getCommentByFeedId(id: number): Promise<Array<Comment>> {
    return await this.repo.find({ feed: id }, ['user']);
  }

  async getCommentById(id: number): Promise<Comment> {
    return await this.repo.findOne({ id }, ['user']);
  }

  async getCommentsCountByFeedId(feedId: number): Promise<number> {
    return await this.repo.count({ feed: feedId });
  }

  async updateComment(comment: Comment): Promise<Comment> {
    await this.repo.flush();
    return comment;
  }

  async deleteCommentById(id: number): Promise<boolean> {
    try {
      console.log('deleteComment:', id);
      const toBeRemoved = await this.repo.findOneOrFail({ id });
      await this.repo.removeAndFlush(toBeRemoved);
      return true;
    } catch (e) {
      // delete의 경우엔 t/f로 반환한다.
      console.log('[error] deleteCommentById:', e);
      return false;
    }
  }
}

export default CommentRepository;
