import { Entity, ManyToOne } from '@mikro-orm/core';
import Feed from './Feed';
import Tag from './Tag';

@Entity()
export default class MapFeedNTag {
  @ManyToOne({ cascade: [], primary: true })
  feed: Feed;

  @ManyToOne({ cascade: [], primary: true })
  tag: Tag;
}
