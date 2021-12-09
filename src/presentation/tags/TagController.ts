import { Response } from 'express';
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
  Redirect,
  Render,
  Req,
  Res,
  Session,
  SessionParam,
} from 'routing-controllers';
import { Service } from 'typedi';
import User from '../../domain/entities/User.js';
import Tag from '../../domain/entities/Tag.js';
import TagService from '../../application/TagService.js';
import TagCreateOrUpdateDTO from './TagCreateOrUpdateDTO.js';

const logger = debug('heavenJosun:TagCon');

@Service()
@Controller('/tags')
export default class TagController {
  private tagService: TagService;

  constructor(tagService: TagService) {
    this.tagService = tagService;
  }

  @Post('/')
  // @Redirect('/feeds')
  async createTag(
    @SessionParam('user') authenticatedUser: User,
    @Body() createDTO: TagCreateOrUpdateDTO,
    @Req() req,
  ): Promise<void> {
    logger('createDTO:', createDTO);
    const { tagname } = createDTO;
    const toCreate = new Tag(tagname);
    logger('authenticatedUser:', authenticatedUser);
    logger(req.session);

    if (!authenticatedUser) throw new Error('로그인되지 않은 사용자입니다.');

    const created = await this.tagService.createTag(toCreate);
    logger('created:', created);
  }

  @Get('/')
  @Render('index')
  async getAllTags() {
    const listOfTags = await this.tagService.getAllTags(0, 0, 0);
    return { tags: listOfTags };
  }

  @Put('/:id')
  async updateTag(@Param('id') id: number, @Body() updateDTO: TagCreateOrUpdateDTO): Promise<void> {
    await this.tagService.updateTag(id, updateDTO);
  }

  @Delete('/:id')
  @Render('index')
  async deleteTagById(@Param('id') id: number): Promise<void> {
    await this.tagService.deleteTagById(id);
  }
}
