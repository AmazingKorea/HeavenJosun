import { MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mysql';
import User from '../entities/User.js';

class UserRepository {
  // MikroORM 구현체
  private repo: EntityRepository<User>;

  // MikroORM 인스턴스가 초기화된 후 FeedRepository가 생성될 수 있음.
  constructor(orm: MikroORM) {
    this.repo = orm.em.getRepository(User);
  }

  async createUser(user: User): Promise<User> {
    const toCreate = this.repo.create(user);
    await this.repo.persist(toCreate).flush();
    return toCreate;
  }

  async getUserById(id: number): Promise<User> {
    try {
      return await this.repo.findOne({ id });
    } catch (e) {
      console.log('failed!');
      console.log(e);
      return null;
    }
  }

  async getUserByUsernameAndPassword(username: string, password: string): Promise<User> {
    return await this.repo.findOne({ username, password });
    // 이게 없을 땐 Promise<null> 로 오나?
  }

  async updateUser(user: User): Promise<User> {
    // flush는 특정 Entity의 변경분을 DB에 반영하는 것이 아닌,
    // 현재 req에서 발생한 모든 객체의 변경분을 반영한다고 한다.
    await this.repo.flush(); // 흠.. 구현이 조금 이상하긴 하다.
    return user;
  }

  async deleteUserById(id: number): Promise<boolean> {
    try {
      const toBeRemoved = await this.repo.findOneOrFail({ id });
      await this.repo.removeAndFlush(toBeRemoved);
      return true;
    } catch (e) {
      console.log('[error] deleteUserById:', e);
      return false;
    }
  }
}

export default UserRepository;
