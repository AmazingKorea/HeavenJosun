import { Service } from 'typedi';
import Feed from '../domain/entities/Feed.js';
import User from '../domain/entities/User.js';
import FeedRepository from '../domain/repositories/FeedRepository.js';
import TagRepository from '../domain/repositories/TagRepository.js';
import FeedCreateOrUpdateDTO from '../presentation/feeds/FeedCreateOrUpdateDTO.js';
import FeedUpdateVoteDTO from '../presentation/feeds/FeedUpdateVoteDTO.js';

/*
  CRUD 서비스이므로 메소드는 C>R>U>D 순서로 정의한다.

  CRUD 서비스의 경우 자체 로직에서 예외가 발생할 일이 없는 경우 try-catch 구문을 쓰지 않고,
  Controller 혹은 Middleware에서 catch하도록 둔다.
*/
@Service()
class FeedService {
  private feedRepository: FeedRepository;
  private tagRepository: TagRepository;

  constructor(feedRepository: FeedRepository, tagRepository: TagRepository) {
    this.feedRepository = feedRepository;
    this.tagRepository = tagRepository;
  }

  async createFeed(owner: User, createDTO: FeedCreateOrUpdateDTO): Promise<Feed> {
    const { title, body, tag_id } = createDTO;
    const tag = await this.tagRepository.getTagById(Number.parseInt(tag_id));
    console.log(12212);
    const toCreate = new Feed(title, body);
    const createdFeed = await this.feedRepository.createFeed(owner, toCreate, tag);
    return createdFeed;
  }

  async getFeedById(id: number): Promise<Feed> {
    const feed = await this.feedRepository.getFeedById(id);
    console.log('feed: ', feed);
    return feed;
  }

  async getFeedsFrom(begin, count, sort): Promise<Array<Feed>> {
    const feeds = await this.feedRepository.getFeedsFrom(begin, count, sort);
    return feeds;
  }

  async getFeedsOrderByVotes(begin, count, sort): Promise<Array<Feed>> {
    const feeds = await this.feedRepository.getFeedsOrderByVotes(begin, count, sort);
    return feeds;
  }

  async getFeedsByTag(begin, count, sort, tag): Promise<Array<Feed>> {
    const feeds = await this.feedRepository.getFeedsByTag(begin, count, sort, tag);
    return feeds;
  }

  async updateFeed(id: number, updateDTO: FeedCreateOrUpdateDTO): Promise<Feed> {
    const toUpdate = await this.feedRepository.getFeedById(id);
    if (!toUpdate) {
      throw new Error(`id=${id}에 대응되는 feed가 없습니다.`);
    }
    const tag = await this.tagRepository.getTagById(Number.parseInt(updateDTO.tag_id));
    toUpdate.updateContent(updateDTO.title, updateDTO.body, tag);
    return await this.feedRepository.updateFeed(toUpdate);
  }

  async updateVoteCount(id: number, updateDTO: FeedUpdateVoteDTO): Promise<void> {
    const feed = await this.feedRepository.getFeedById(id);
    const { delta: delta } = updateDTO;
    feed.updateVoteCount(Number.parseInt(delta));
    await this.feedRepository.updateFeed(feed);
  }

  async deleteFeedById(id: number): Promise<boolean> {
    try {
      return await this.feedRepository.deleteFeedById(id);
    } catch (e) {
      // 얘만 예외처리한 이유? 글쎄.
      throw new Error(`Feed ID=${id} 삭제 중 오류가 발생했습니다.`);
    }
  }
}

export default FeedService;
