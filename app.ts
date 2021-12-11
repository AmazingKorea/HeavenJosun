import 'reflect-metadata';
import dotenv from 'dotenv';
import { Container as TypeDIContainer } from 'typedi';
import express, { json, urlencoded } from 'express';
import session from 'express-session';
import { useExpressServer, useContainer } from 'routing-controllers';
import path from 'path';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import FeedRepository from './src/domain/repositories/FeedRepository';
import mikroOrmConfig from './mikro-orm.config';
import UserRepository from './src/domain/repositories/UserRepository';
import CommentRepository from './src/domain/repositories/CommentRepository';
import TagRepository from './src/domain/repositories/TagRepository';

(async () => {
  // dirname
  //const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.resolve(); //dirname(__filename);
  console.log('dirname: ', __dirname);

  // dotenv 설정
  dotenv.config();

  // 비동기로 MikroORM이 초기화된 후에야 Repository를 생성할 수 있는데 더 깔끔한 방법이 없을까?
  /* @ts-ignore */
  const orm = await MikroORM.init(mikroOrmConfig);
  console.log(orm.em); // access EntityManager via `em` property

  // View Engine 설정
  const expressApp = express();
  expressApp.set('views', path.join(__dirname, '/views')); // 설정을 다르게 해야 할듯?
  expressApp.set('view engine', 'ejs');
  // 이게 기본으로 안 들어간다니, routing-controllers라면 해줄만한데.
  expressApp.use(json());
  expressApp.use(urlencoded({ extended: true, limit: '50mb' })); // urlencoded의 upload limit 100kb->50mb
  // expressApp.use(cookieParser()); // 아마 필요 없을듯?
  expressApp.use(express.static(path.join(__dirname, '/public')));
  expressApp.use(
    session({
      secret: 'helloworld',
      name: 'heavenJosun.sessionId', // 디버깅 쉬우라고 눈에 띄는 이름으로 지정
    }),
  );

  // Type DI 설정
  useContainer(TypeDIContainer);

  const userRepository = new UserRepository(orm);

  // Repository는 직접 의존성 명시
  TypeDIContainer.set(UserRepository, userRepository);
  TypeDIContainer.set(FeedRepository, new FeedRepository(orm));
  TypeDIContainer.set(CommentRepository, new CommentRepository(orm));
  TypeDIContainer.set(TagRepository, new TagRepository(orm));

  // 요청 별로 DB context를 생성한다.
  expressApp.use((_, __, next) => {
    RequestContext.create(orm.em, next);
  });

  expressApp.use(async (req, _, next) => {
    // 하.. 개노답.. detached가 따로 없으니 그냥 신규인줄 알고 PK id가 있어도 저장하려고 들음.
    // @ts-ignore
    if (req.session && req.session.user && req.session.user.id) {
      try {
        // @ts-ignore
        req.session.user = await userRepository.getUserById(req.session.user.id);
        console.log("user's inserted");
      } catch (e) {
        // @ts-ignore
        req.session.user = undefined; // 여기서 오류나면 Uncaught Promise로 서버가 죽음
      }
    }
    next();
  });

  // Controller, Middleware 등록
  const app = useExpressServer(expressApp, {
    controllers: [path.join(__dirname + '/build/src/presentation/**/*Controller.js')],
    middlewares: [path.join(__dirname + '/build/src/presentation/middlewares/*.js')],
    // controllers: [FeedController],
    // middlewares: [AFTER_MIDD, BEFORE_MIDD, GlobalErrorHandler],
    defaultErrorHandler: false,
    classTransformer: true,
  });

  // 서버 시작
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
})();
