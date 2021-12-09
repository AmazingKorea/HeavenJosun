import debug from 'debug';
import {
  Body,
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
  SessionParam,
} from 'routing-controllers';
import { Service } from 'typedi';
import CommentService from '../../application/CommentService.js';

import Comment from '../../domain/entities/Comment.js';
import Feed from '../../domain/entities/Feed.js';
import User from '../../domain/entities/User.js';
import CommentCreateOrUpdateDTO from './CommentCreateOrUpdateDTO.js';

const logger = debug('heavenJosun:commentCon');

@Service()
@Controller('/comments')
export class CommentController {
  private commentService: CommentService;

  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  @Post('/')
  @Redirect('/')
  async createComment(
    @SessionParam('user') authenticatedUser: User,
    @Body() createDTO: CommentCreateOrUpdateDTO,
    @Req() req,
  ): Promise<void> {
    logger('createDTO:', createDTO);
    logger('authenticatedUser:', authenticatedUser);
    logger(req.session);

    if (!authenticatedUser) throw new Error('로그인되지 않은 사용자입니다.');

    const created = await this.commentService.createComment(authenticatedUser, createDTO);
    logger('created:', created);
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

  @Put('/:id')
  async updateComment(
    @Param('id') id: number,
    @Body() updateDTO: CommentCreateOrUpdateDTO,
  ): Promise<void> {
    await this.commentService.updateComment(id, updateDTO);
  }

  @Put('/:id/vote')
  async voteForComment(@Param('id') id: number, @QueryParam('delta') delta: number) {
    const updated = await this.commentService.updateVoteCount(id, delta);
    return { comment: updated };
  }

  @Delete('/:id')
  // @Redirect('home')
  async deleteCommentById(@Param('id') id: number): Promise<void> {
    await this.commentService.deleteCommentById(id);
  }
}
