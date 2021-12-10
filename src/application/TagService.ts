import { Service } from 'typedi';
import Tag from '../domain/entities/Tag.js';
import TagRepository from '../domain/repositories/TagRepository.js';
import TagCreateOrUpdateDTO from '../presentation/tags/TagCreateOrUpdateDTO.js';

/*
  CRUD 서비스이므로 메소드는 C>R>U>D 순서로 정의한다.

  CRUD 서비스의 경우 자체 로직에서 예외가 발생할 일이 없는 경우 try-catch 구문을 쓰지 않고,
  Controller 혹은 Middleware에서 catch하도록 둔다.
*/
@Service()
class TagService {
  private tagRepository: TagRepository;
  constructor(tagRepository: TagRepository) {
    this.tagRepository = tagRepository;
  }
  async createTag(tag: Tag): Promise<Tag> {
    await this.tagRepository.createTag(tag);
    return tag;
  }
  async getAllTags(begin, count, sort): Promise<Array<Tag>> {
    const tags = await this.tagRepository.getAllTags(begin, count, sort);
    console.log('found:', tags);
    return tags;
  }

  async getFeedById(id: number): Promise<Tag> {
    const tag = await this.tagRepository.getTagById(id);
    return tag;
  }

  // async updateTag(id: number, updateDTO: TagCreateOrUpdateDTO): Promise<Tag> {
  //   const toUpdate = await this.tagRepository.getTagById(id);
  //   if (!toUpdate) {
  //     throw new Error(`id=${id}에 대응되는 tag가 없습니다.`);
  //   }
  //   toUpdate.updateTag(updateDTO.tagname);
  //   return await this.tagRepository.updateTag(toUpdate);
  // }
  async deleteTagById(id: number): Promise<boolean> {
    try {
      return await this.tagRepository.deleteTagById(id);
    } catch (e) {
      // 얘만 예외처리한 이유? 글쎄.
      throw new Error(`Tag ID=${id} 삭제 중 오류가 발생했습니다.`);
    }
  }
}

export default TagService;
