import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { IsString } from 'class-validator';

@Entity()
@Unique({ properties: ['tagname'] }) // tagname은 겹치면 안 됨
export default class Tag {
  @PrimaryKey()
  @Property()
  id: number;

  @Property()
  @IsString()
  tagname: string; // 태그명

  // 신규 태그 생성 시
  constructor(tagname: string) {
    this.tagname = tagname;
  }
}
