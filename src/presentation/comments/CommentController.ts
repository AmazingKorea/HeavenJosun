import debug from 'debug';
import {
  Body,
  BodyParam,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  QueryParam,
  Redirect,
  Render,
  Req,
  Res,
  SessionParam,
} from 'routing-controllers';
import { Service } from 'typedi';
import CommentService from '../../application/CommentService.js';

import Comment from '../../domain/entities/Comment.js';
import Feed from '../../domain/entities/Feed.js';
import User from '../../domain/entities/User.js';
import CommentCreateOrUpdateDTO from './CommentCreateOrUpdateDTO.js';
import CommentUpdateVoteDTO from './CommentUpdateVoteDTO.js';

const logger = debug('heavenJosun:commentCon');

@Service()
@Controller('/comments')
export class CommentController {
  private commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  @Post('/')
  async createComment(
    @SessionParam('user') authenticatedUser: User,
    @Body() createDTO: CommentCreateOrUpdateDTO,
    @Req() req,
    @Res() res,
  ): Promise<void> {
    logger('createDTO:', createDTO);
    logger('authenticatedUser:', authenticatedUser);
    logger(req.session);

    if (!authenticatedUser) throw new Error('로그인되지 않은 사용자입니다.');

    const created = await this.commentService.createComment(authenticatedUser, createDTO);
    logger('created:', created);

    res.redirect(`/feeds/${createDTO.feed_id}`);
  }

  @Get('/feeds/:id')
  @Render('feeddetail')
  async getCommentByFeedId(@Param('id') id: number) {
    const listofComments = await this.commentService.getCommentById(id);
    return { comments: listofComments };
  }

  @Get('/:id')
  async getCommentById(@Param('id') id: number) {
    const listofComments = await this.commentService.getCommentById(id);
    return { comments: listofComments };
  }

  @Post('/:id')
  async updateComment(
    @Param('id') id: number,
    @Body() updateDTO: CommentCreateOrUpdateDTO,
    @Res() res,
  ) {
    await this.commentService.updateComment(id, updateDTO);
    res.redirect(`/feeds/${updateDTO.feed_id}`);
  }

  @Post('/:id/vote')
  async voteForComment(
    @Param('id') id: number,
    @Body() updateDTO: CommentUpdateVoteDTO,
    @Res() res,
  ) {
    const updated = await this.commentService.updateVoteCount(id, updateDTO);
    res.redirect(`/feeds/${updated.feed.id}`);
  }

  @Post('/:id/del')
  @Redirect('home')
  async deleteCommentById(
    @Param('id') id: number,
    @BodyParam('feed_id') feedId: number,
    @Res() res,
  ) {
    await this.commentService.deleteCommentById(id);
    res.redirect(`/feeds/${feedId}`);
  }
}
