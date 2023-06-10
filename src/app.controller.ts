import { Body, Controller, Get, Post } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
// import { authenticate } from 'middleware/google.middleware';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Public } from './common/decorators';
import { User } from './users/user.entity';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get('route')
  // @UseGuards(authenticate)
  protectedRoute() {
    // Handle the protected route logic
    // Access the token payload using req.tokenPayload
    return { message: 'Authenticated route' };
  }

  // @Get('/protected')
  // @UseGuards(GoogleOAuthGuard)
  // async test() {
  //   console.log('Protected');
  //   return 'hello';
  // }

  // @Get('/auth/google/callback')
  // @UseGuards(GoogleOAuthGuard)
  // googleAuthRedirect(@Req() req) {
  //   // const auth = this.appService.googleLogin(req);
  //   // return { accessToken: auth['user']['accessToken'] };
  //   console.log('CONROLLET REDIRECT');
  //   // return this.appService.googleLogin(req);
  //   return 'hello';
  //   // res.redirect('http://localhost:8080/dashboard');
  // }

  // @Public()
  // @Get('/auth')
  // @UseGuards(GoogleOAuthGuard)
  // // eslint-disable-next-line @typescript-eslint/no-empty-function
  // async auth() {}

  @Public()
  @Post('login')
  async login(@Body('token') token): Promise<User> {
    console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const data = await this.authService.login({
      email: payload.email,
      username: payload.name,
    });

    return data;
  }
}
