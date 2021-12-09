import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import Feed from './Feed';
import Tag from './Tag';

@Entity()
export default class MapFeedNTag {
  @PrimaryKey()
  @Property()
  @ManyToOne({ cascade: [] })
  feed: Feed;

  @PrimaryKey()
  @Property()
  @ManyToOne({ cascade: [] })
  tag: Tag;

  // constructor(title: string, body: string) {
  //   this.title = title;
  //   this.body = body;
  // }
}
