import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import Feed from '../src/domain/entities/Feed'; // 여기선 왜 js를 떼지?

test('testValidateAndTransform', async () => {
  const feedReqObj = {
    id: 1,
    body: 'hello_world',
    votes: 5,
  };

  // @ts-ignore
  const feed: Feed = new Feed(1234, 'body'); // title: string 타입을 어김.
  const feed2: Feed = new Feed('title2', 'body2');

  try {
    // 마셜링은 잘 됐으니,
    const fromDTO = plainToClass(Feed, feedReqObj);
    await validateOrReject(fromDTO);
    await validateOrReject(feed);
    await validateOrReject(feed2);
  } catch (e) {
    console.log('feed validation error: ', e);
    // 이런 식으로 출력하면 딱 좋을듯 =)
    // 오류 페이지에선 각 row (=e) 마다 행단위로 표시하면 좋을듯 =)
    e.forEach(({ property, value, constraints }) => {
      // constraints가 여러개일 수 있음.
      console.log(
        `Field [${property}](value=[${value}]) is invalid!\n- ${Object.values(constraints).reduce(
          (acc, cur) => {
            acc += cur + '\n';
            return acc;
          },
        )}`,
      );
    });
  } finally {
    console.log('feed validation complete!');
  }
});
