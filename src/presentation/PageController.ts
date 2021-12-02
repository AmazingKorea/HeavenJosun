import debug from 'debug';
import { Controller, Get, Redirect, Render } from 'routing-controllers';
import { Service } from 'typedi';

@Service() // Controller이지만 typedi 마킹을 위해 Service 표시
@Controller()
export class PageController {
  @Get('/')
  @Redirect('/feeds')
  async redirectToFeeds() {
    // todo: nothing;
  }

  @Get('/login')
  @Render('login')
  async renderLoginPage() {
    // todo: nothing;
  }

  @Get('/signup')
  @Render('signup')
  async renderSignupPage() {
    // todo: nothing;
  }
}
