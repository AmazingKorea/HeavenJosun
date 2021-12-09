import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import Comment from '../entities/Comment.js';
import Feed from '../entities/Feed.js';
import User from '../entities/User.js';

class CommentRepository {
  private repo: EntityRepository<Comment>;

  constructor(orm: MikroORM) {
    this.repo = orm.em.getRepository(Comment);
  }

  async createComment(owner: User, comment: Comment): Promise<Comment> {
    const toCreate = this.repo.create(comment);
    toCreate.user = owner;
    console.log('toCreate:', toCreate);
    await this.repo.persist(toCreate).flush();
    return toCreate;
  }

  // TODO: 파라미터 type 결정하기, 이게 맞나??
  async getCommentByFeedId(id: number): Promise<Array<Comment>> {
    return await this.repo.find({ id }, ['feed']);
  }

  async getCommentById(id: number): Promise<Comment> {
    return await this.repo.findOne({ id }, ['user']);
  }

  async updateComment(comment: Comment): Promise<Comment> {
    // flush는 특정 Entity의 변경분을 DB에 반영하는 것이 아닌,
    // 현재 req에서 발생한 모든 객체의 변경분을 반영한다고 한다.
    await this.repo.flush(); // 흠.. 구현이 조금 이상하긴 하다.
    return comment;
  }

  async deleteCommentById(id: number): Promise<boolean> {
    try {
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
