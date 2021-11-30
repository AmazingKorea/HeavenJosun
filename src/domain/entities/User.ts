import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { IsInt, IsString } from 'class-validator';

@Entity()
@Unique({ properties: ['username'] }) // username은 계정명이므로 겹치면 안 됨
export default class User {
  @PrimaryKey()
  @Property()
  @IsInt()
  id: number;

  @Property()
  @IsString()
  username: string; // 사용자 로그인 계정

  @Property()
  @IsString()
  password: string;

  @Property()
  @IsString()
  name: string;

  @Property()
  @IsString()
  role: string; // 추후 Enum으로 변경

  // 신규 유저 생성 시
  constructor(username: string, password: string, name: string) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.role = 'USER';
  }
}
