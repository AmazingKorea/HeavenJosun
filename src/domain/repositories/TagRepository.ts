import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import Tag from '../entities/User.js';

class TagRepository {
  // MikroORM 구현체
  private repo: EntityRepository<Tag>;

  // MikroORM 인스턴스가 초기화된 후 FeedRepository가 생성될 수 있음.
  constructor(orm: MikroORM) {
    this.repo = orm.em.getRepository(Tag);
  }

  async createTag(tag: Tag): Promise<Tag> {
    const toCreate = this.repo.create(tag);
    console.log('toCreate:', toCreate);
    await this.repo.persist(toCreate).flush();
    return toCreate;
  }

  async getTagById(id: number): Promise<Tag> {
    return await this.repo.findOne({ id }, ['tag']);
  }

  // TODO: 파라미터 type 결정하기
  async getAllTags(begin, count, sort): Promise<Array<Tag>> {
    return await this.repo.findAll({});
  }

  async updateTag(tag: Tag): Promise<Tag> {
    await this.repo.flush();
    return tag;
  }

  async deleteTagById(id: number): Promise<boolean> {
    try {
      const toBeRemoved = await this.repo.findOneOrFail({ id });
      await this.repo.removeAndFlush(toBeRemoved);
      return true;
    } catch (e) {
      // delete의 경우엔 t/f로 반환한다.
      console.log('[error] deleteTagById:', e);
      return false;
    }
  }
}

export default TagRepository;
