import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import Feed from '../entities/Feed.js';
import User from '../entities/User.js';

class FeedRepository {
  // MikroORM 구현체
  private repo: EntityRepository<Feed>;

  // MikroORM 인스턴스가 초기화된 후 FeedRepository가 생성될 수 있음.
  constructor(orm: MikroORM) {
    this.repo = orm.em.getRepository(Feed);
  }

  async createFeed(owner: User, feed: Feed): Promise<Feed> {
    const toCreate = this.repo.create(feed);
    toCreate.user = owner;
    console.log('toCreate:', toCreate);
    await this.repo.persist(toCreate).flush();
    return toCreate;
  }

  async getFeedById(id: number): Promise<Feed> {
    return await this.repo.findOne({ id }, ['user']);
  }

  // TODO: 파라미터 type 결정하기
  async getFeedsFrom(begin, count, sort): Promise<Array<Feed>> {
    return await this.repo.find({}, ['user']); // 타입이 애매해서 일단 이걸로
    // 'user'를 명시하지 않으면 Join되지 않고 Id만 저장된 상태로 온다.
  }

  async updateFeed(feed: Feed): Promise<Feed> {
    // flush는 특정 Entity의 변경분을 DB에 반영하는 것이 아닌,
    // 현재 req에서 발생한 모든 객체의 변경분을 반영한다고 한다.
    await this.repo.flush(); // 흠.. 구현이 조금 이상하긴 하다.
    return feed;
  }

  async deleteFeedById(id: number): Promise<boolean> {
    try {
      const toBeRemoved = await this.repo.findOneOrFail({ id });
      await this.repo.removeAndFlush(toBeRemoved);
      return true;
    } catch (e) {
      // delete의 경우엔 t/f로 반환한다.
      console.log('[error] deleteFeedById:', e);
      return false;
    }
  }
}

export default FeedRepository;
