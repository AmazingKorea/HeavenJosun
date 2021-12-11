import debug from 'debug';
import moment from 'moment';
import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Render,
  Res,
  QueryParam,
  Redirect,
  SessionParam,
} from 'routing-controllers';
import { Service } from 'typedi';
import CommentService from '../../application/CommentService.js';
import FeedService from '../../application/FeedService.js';
import TagService from '../../application/TagService.js';

import Feed from '../../domain/entities/Feed.js';
import User from '../../domain/entities/User.js';
import FeedCreateOrUpdateDTO from './FeedCreateOrUpdateDTO.js';
import FeedUpdateVoteDTO from './FeedUpdateVoteDTO.js';

const logger = debug('heavenJosun:feedCon');

@Service() // Controller이지만 typedi 마킹을 위해 Service 표시
@Controller('/feeds')
export class FeedController {
  private feedService: FeedService;
  private commentService: CommentService;
  private tagService: TagService;

  constructor(feedService: FeedService, commentService: CommentService, tagService: TagService) {
    this.feedService = feedService;
    this.commentService = commentService;
    this.tagService = tagService;
  }

  @Get('/write')
  @Render('feedwrite')
  async renderFeedWritePage() {
    const listOfTags = await this.tagService.getAllTags(0, 0, 0);
    logger('tag list:', listOfTags);
    return { tags: listOfTags };
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
  async createFeed(
    @SessionParam('user') authenticatedUser: User,
    @Body() createDTO: FeedCreateOrUpdateDTO,
  ): Promise<void> {
    logger('createDTO:', createDTO);
    logger('authenticatedUser:', authenticatedUser);

    if (!authenticatedUser) throw new Error('로그인되지 않은 사용자입니다.');

    const created = await this.feedService.createFeed(authenticatedUser, createDTO);
    logger('created:', created); // id가 부여돼있다. (flush하면서 db 상태를 가져오는 것도 하는듯.)
  }

  @Get('/:id')
  @Render('feeddetail')
  async getFeedById(@Param('id') id: number, @Res() res) {
    const feed = await this.feedService.getFeedById(id);
    const commentsByFeedId = await this.commentService.getCommentsByFeedId(id);
    res.locals.feedId = id; // 댓글 작성용
    const commentsCount = await this.commentService.getCommentsCountByFeedId(id);
    const listOfTags = await this.tagService.getAllTags(0, 0, 0);
    return {
      title: 'HeavenJosun',
      feed: {
        ...feed,
        commentsCount,
        createdAt: moment(feed.createdAt).fromNow(),
        //updatedAt: moment(feed.updatedAt).fromNow(),
      },
      comments: commentsByFeedId.map(comment => ({
        ...comment,
        createdAt: moment(comment.createdAt).fromNow(),
        //updatedAt: moment(comment.updatedAt).fromNow(),
      })),
      tags: listOfTags,
    };
  }

  @Get('/')
  @Render('index')
  async getFeedsFrom(
    @QueryParam('msg') msg: string,
    @QueryParam('order') order: string,
    @QueryParam('tag') tag: string,
    @Res() res,
  ) {
    const listOfTags = await this.tagService.getAllTags(0, 0, 0);
    res.locals.msgType = 'info';
    res.locals.msg = msg;
    console.log('msg:', msg);
    console.log('order:', order);
    console.log('tag:', tag);

    let listOfFeeds;
    if (tag) {
      listOfFeeds = await this.feedService.getFeedsByTag(0, 0, 0, tag);
    } else if (order == 'hot') {
      listOfFeeds = await this.feedService.getFeedsOrderByVotes(0, 0, 0);
    } else {
      listOfFeeds = await this.feedService.getFeedsFrom(0, 0, 0);
    }

    for (const feed of listOfFeeds) {
      const counts = await this.commentService.getCommentsCountByFeedId(feed.id);

      // @ts-ignore
      feed.commentsCount = counts;
      console.log('commentsCount:', counts);
    }

    return {
      feeds: listOfFeeds.map(feed => ({
        ...feed,
        createdAt: moment(feed.createdAt).fromNow(),
        //updatedAt: moment(feed.updatedAt).fromNow(),
      })),
      tags: listOfTags,
    };
  }

  @Post('/:id/put')
  async updateFeed(@Param('id') id: number, @Body() updateDTO: FeedCreateOrUpdateDTO, @Res() res) {
    await this.feedService.updateFeed(id, updateDTO);
    res.redirect(`/feeds/${id}`);
  }

  @Post('/:id/vote')
  async voteForFeed(@Param('id') id: number, @Body() updateDTO: FeedUpdateVoteDTO, @Res() res) {
    await this.feedService.updateVoteCount(id, updateDTO);
    res.redirect(`/feeds/${id}`);
  }

  @Post('/:id/del')
  @Redirect('/feeds')
  async deleteFeedById(@Param('id') id: number): Promise<void> {
    await this.feedService.deleteFeedById(id);
  }
}
