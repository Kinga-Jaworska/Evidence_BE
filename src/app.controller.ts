import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { GoogleOAuthGuard } from './common/guards';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('auth')
  // @UseGuards(AuthGuard('google'))
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // async auth() {}

  // // @Get()
  // // @UseGuards(AuthGuard('google'))
  // // async googleAuth(@Request() req) {}

  // @Get('redirect')
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Request() req) {
  //   const resp = await this.appService.googleLogin(req);
  //   return resp['user'];
  // }

  @Get('new')
  // @UseGuards(AuthGuard('google'))
  async test() {
    return 'new';
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req) {
    console.log('CONROLLer AUTH');
  }

  @Get('redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req) {
    // const auth = this.appService.googleLogin(req);
    // return { accessToken: auth['user']['accessToken'] };
    console.log('CONROLLET REDIRECT');
    return this.appService.googleLogin(req);
  }
}
