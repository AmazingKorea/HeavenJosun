import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { IsInt, IsString } from 'class-validator';
import User from './User';
import Feed from './Feed';

@Entity()
export default class Comment {
  @PrimaryKey()
  @Property()
  id: number;

  @ManyToOne({ cascade: [] })
  user: User;

  @ManyToOne({ cascade: [] })
  feed: Feed;

  @Property()
  @IsString()
  content: string;

  @Property()
  @IsInt()
  votes = 0;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(owner: User, feed: Feed, content: string) {
    this.user = owner;
    this.feed = feed;
    this.content = content;
  }

  public updateVoteCount(delta: number): void {
    this.votes += delta;
  }

  public updateContent(content: string): void {
    this.content = content;
  }
}
