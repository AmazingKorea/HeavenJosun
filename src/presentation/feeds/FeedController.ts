import debug from 'debug';
import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Render,
  QueryParam,
  Redirect,
  SessionParam,
} from 'routing-controllers';
import { Service } from 'typedi';
import FeedService from '../../application/FeedService.js';

import Feed from '../../domain/entities/Feed.js';
import User from '../../domain/entities/User.js';
import FeedCreateOrUpdateDTO from './FeedCreateOrUpdateDTO.js';

const logger = debug('heavenJosun:feedCon');

@Service() // Controller이지만 typedi 마킹을 위해 Service 표시
@Controller('/feeds')
export class FeedController {
  private feedService: FeedService;

  constructor(feedService: FeedService) {
    this.feedService = feedService;
  }

  @Get('/write')
  @Render('feedwrite')
  async renderFeedWritePage() {
    // todo: nothing;
  }

  /**
   * 피드 등록
   *
   * @param authenticatedUser 세션이 넣어 놓은 로그인된 사용자 객체
   * @param createDTO -
   * @returns /feeds 페이지로 리다이렉트한다.
   */
  @Post('/')
  @Redirect('/feeds')
  // 끔찍한 일.. JsonBody만 형변환이 됨. 아니 형변환 할 필요가 없음.
  // BodyParam으로 받으면 형변환이 됨. (하...)
  // try-catch로 열고 나서 수동으로 redirect를 주는 게 맞을듯?
  async createFeed(
    @SessionParam('user') authenticatedUser: User,
    @Body() createDTO: FeedCreateOrUpdateDTO,
  ): Promise<void> {
    logger('createDTO:', createDTO);
    const { title, body } = createDTO;
    const toCreate = new Feed(title, body);
    logger('authenticatedUser:', authenticatedUser);

    // 이건 middleware로 authenticatedPath를 검증해서 미리 오류로 보내는 것도 좋을듯.
    if (!authenticatedUser) throw new Error('로그인되지 않은 사용자입니다.');

    const created = await this.feedService.createFeed(authenticatedUser, toCreate);
    logger('created:', created); // id가 부여돼있다. (flush하면서 db 상태를 가져오는 것도 하는듯.)
  }

  @Get('/:id')
  @Render('feeddetail')
  async getFeedById(@Param('id') id: number) {
    const feed = await this.feedService.getFeedById(id);
    return { feed, title: 'HeavenJosun' };
  }

  @Get('/')
  @Render('index')
  async getFeedsFrom() {
    const listOfFeeds = await this.feedService.getFeedsFrom(0, 0, 0);
    return { feeds: listOfFeeds };
  }

  @Put('/:id')
  async updateFeed(
    @Param('id') id: number,
    @Body() updateDTO: FeedCreateOrUpdateDTO,
  ): Promise<void> {
    await this.feedService.updateFeed(id, updateDTO);
  }

  @Put('/:id/vote')
  async voteForFeed(@Param('id') id: number, @QueryParam('delta') delta: number) {
    const updated = await this.feedService.updateVoteCount(id, delta);
    return { feed: updated };
  }

  // 삭제는 그냥 Redirect.
  // 삭제 버튼을 누르면 삭제에 성공했음을 반환하고 Redirect시킴
  @Delete('/:id')
  @Redirect('home')
  async deleteFeedById(@Param('id') id: number): Promise<void> {
    await this.feedService.deleteFeedById(id);
  }
}
