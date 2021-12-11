import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import User from './User';
import Tag from './Tag';
import Comment from './Comment';

@Entity()
export default class Feed {
  // #으로 시작하는 private fields에는 decorator를 못 쓴다고 함.
  // MikroORM 특성인지 모르겠는데 private 접근제어자를 쓴 필드도 접근이 안 됨.
  @PrimaryKey()
  @Property()
  id: number;

  // ManyToOne 단방향 관계 (Feed만 User를 알면 됨)
  // ManyToOne의 경우 Property 데코레이터를 사용하지 않아야 한다.
  // 아래의 cascade는 일단 attached된 객체에 한함.
  @ManyToOne({ cascade: [] })
  user: User;

  @ManyToOne({ cascade: [] })
  tag: Tag;

  @Property()
  @IsString()
  title: string;

  @Property({ length: 16000 })
  @IsString()
  body: string;

  @Property()
  @IsInt()
  votes = 0;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // MikroORM은 constructor로 객체를 생성하지 않으므로 required property를 담는 생성자가 필요 없다.
  // https://mikro-orm.io/docs/entity-constructors/
  constructor(title: string, body: string) {
    this.title = title;
    this.body = body;
  }

  public updateVoteCount(delta: number): void {
    this.votes += delta;
  }

  public updateContent(title: string, body: string, tag: Tag): void {
    this.title = title;
    this.body = body;
    this.tag = tag;
  }
}
