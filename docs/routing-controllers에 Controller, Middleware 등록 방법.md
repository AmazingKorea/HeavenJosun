아래와 같이 생성자를 import해서 배열로 넘겨주면 등록된다.

현재 폴더 단위 등록은 안 된다.

```ts
import FeedController from './src/presentation/feeds/FeedController.js';
import {
  AFTER_MIDD,
  BEFORE_MIDD,
  GlobalErrorHandler,
} from './src/presentation/middlewares/GlobalErrorHandler.js';

// [?] 아래 내용은 무슨 뜻이지?
// tsc-watch로 import할 때는 .ts 파일을 import할 수 없다. 모듈이 아닌 것을 import하는 오류가 발생함.

const app = useExpressServer(expressApp, {
  // 아래의 코드는 작동되지 않음.
  // controllers: [__dirname + '/src/presentation/**/*Controller.js'],
  controllers: [FeedController],

  // 인터셉터 폴더 밑으로 미들웨어로 등록
  // 미들웨어는 before, after 옵션이 있음
  middlewares: [AFTER_MIDD, BEFORE_MIDD, GlobalErrorHandler],

  // 오류 발생시 400 으로 JSON 응답을 하기 때문에 재정의해줘야 함.
  defaultErrorHandler: false,
});
```