import debug from 'debug';
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  ExpressMiddlewareInterface,
} from 'routing-controllers';
import { Service } from 'typedi';

const errLogger = debug('heavenJosun:error');
const b4Logger = debug('before');
const a4Logger = debug('after');

/*
이 프로젝트는 컴포넌트의 최소화가 주요 목표이므로, 여기서 모든 예외 처리와 로깅을 수행한다.
*/
// 미들웨어이지만 typedi 마킹을 위해 Service 표시
@Service()
// 얘도 이 어노테이션이 없으면 작동하지 않음.
@Middleware({ type: 'after' })
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  // 인자가 4개여야 error handler로 등록 가능
  /* eslint-disable @typescript-eslint/no-unused-vars */
  error(error: any, request: any, response: any, next: (err: any) => any) {
    const fullErrorMsg = Object.keys(error).reduce((msg, key) => {
      if (!key || !error[key]) return msg;
      return msg + key + ': ' + error[key] + '\n';
    }, '');
    errLogger(fullErrorMsg || error); // fullErrorMsg가 빈 문자열일 때가 있음. 그럼 메시지 객체를 출력하면 됨
    response.render('error', {
      status: 500,
      message: fullErrorMsg.replaceAll('\n', '<br/>') || error,
    });
  }
}

@Service()
@Middleware({ type: 'after', priority: 1 })
export class AFTER_MIDD implements ExpressMiddlewareInterface {
  use(request: any, response: any, next: (err?: any) => any) {
    a4Logger('A');
    next();
  }
}

@Service()
// 이 어노테이션이 없으면 작동을 하지 않음.
@Middleware({ type: 'before' })
export class BEFORE_MIDD implements ExpressMiddlewareInterface {
  /**
   * Called before controller action is being executed.
   * This signature is used for Express Middlewares.
   */
  use(request: any, response: any, next: (err?: any) => any): any {
    b4Logger(`hi!`);
    // b4Logger(`${request.method} ${request.path}`);
    if (request.session && request.session.user) {
      response.locals.user = request.session.user;
    }
    next();
  }
}
