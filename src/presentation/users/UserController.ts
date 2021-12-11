import { Response } from 'express';
import {
  Body,
  BodyParam,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Res,
  Session,
} from 'routing-controllers';
import { Service } from 'typedi';
import UserService from '../../application/UserService';
import UserRegisterDTO from './UserRegisterDTO';

@Service()
@Controller('/users')
export default class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * 회원가입
   *
   * @param userRegisterDTO -
   * @param session 회원가입 성공 시 세션에 바로 유저 객체를 담아 곧장 로그인시킨다.
   */
  @Post('/')
  async registerUser(
    @Body() userRegisterDTO: UserRegisterDTO,
    @Session() session: any,
    @Res() res,
  ) {
    /*
    TODO:
    중복 사용자 가입 시도 시 ORM에서 전달하는 예외 객체 내용 (Error 객체의 k-v)
    아래 내용의 조건이 걸리면 ErrorMiddleware로 보내기보단 계정 생성 페이지로 리다이렉트할 것
    code: ER_DUP_ENTRY
    errno: 1062
    sqlState: 23000
    sqlMessage: Duplicate entry 'seongbin' for key 'user_username_unique'
    name: UniqueConstraintViolationException
    */
    try {
      const created = await this.userService.registerUser(userRegisterDTO);
      // 여기서 예외가 발생하지 않았으면 정상적으로 생성된 것
      session.user = created;
      res.redirect('/feeds?msg=성공적으로 가입되었습니다.');
    } catch (e) {
      res.redirect('/signup?msg=회원가입에 실패했습니다.');
    }
  }

  /**
   * 로그인
   *
   * @param session query한 사용자가 존재하면 세션에 저장하기 위함
   * @param res Redirect를 조건별로 하기 위함
   * @param username -
   * @param password -
   */
  @Post('/login')
  async loginUser(
    @Session() session: any,
    @Res() res: Response,
    @BodyParam('username') username: string,
    @BodyParam('password') password: string,
  ) {
    try {
      const found = await this.userService.getUserByUsernameAndPassword(username, password);
      console.log('user found:', found);
      if (!found) throw Error('User not found');
      session.user = found;
      res.redirect('/feeds?msg=정상적으로 로그인되었습니다.');
    } catch (e) {
      res.redirect('/login?msg=등록된 사용자가 아닙니다.');
    }
  }
}
