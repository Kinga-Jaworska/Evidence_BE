import { Body, Controller, Get, Post } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Public } from './common/decorators';
import { User } from './users/user.entity';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get('/protected')
  async test() {
    console.log('Protected');
    return 'hello';
  }

  @Public()
  @Post('/login')
  async login(@Body('token') token): Promise<User> {
    console.log(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // console.log('PAYLOAD', payload);
    const data = await this.authService.login({
      email: payload.email,
      username: payload.name,
    });

    return data;
  }
}
