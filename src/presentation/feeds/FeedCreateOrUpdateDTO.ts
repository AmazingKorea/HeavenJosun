import { IsString } from 'class-validator';

/**
 * 지금 (title, body)만 있는 경우 필요 없는 수준이지만,
 * 그래도 필요한 이유는
 * - 첫째로 이 두 필드가 항상 같이 묶여다니기 때문에 묶어주는 게 필요하며,
 * - 둘째로 새로운 필드가 추가될 때 중복으로 수정해야 할 곳이 매우 줄어들기 때문이다.
 */
export default class FeedCreateOrUpdateDTO {
  // UpdateDTO에선 있어야 함. 클래스 소모를 줄이기 위해서 해당 DTO를 공유하는 것을 선택함.
  // 제대로 된 객체지향 프로젝트라면 이렇게 DTO를 선언해선 안될 것.
  // @IsOptional() // Nullable
  // @IsInt()
  // id?: number;

  // 작성자 필드는 Feed를 작성할 때 직접 넣어줄 거니까 생성 DTO엔 있으면 안 됨.
  // user_id: number;

  // @Exclude()
  // _votes: number;

  // @IsOptional() // Nullable
  // @Expose() // votes getter를 노출한다.
  // @IsInt()
  // get votes(): number {
  //   return this._votes;
  // }

  // set votes(v: string | number) {
  //   if (typeof v === 'number') this._votes = v;
  //   else this._votes = Number.parseInt(v);
  // }

  // Required
  @IsString()
  title: string;

  // Required
  @IsString()
  body: string;

  @IsString()
  tag_id: string;
}
