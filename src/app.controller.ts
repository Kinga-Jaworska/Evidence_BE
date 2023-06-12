import { Body, Controller, Post } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
// import { authenticate } from 'middleware/google.middleware';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { Public } from './common/decorators';
import { User } from './users/user.entity';

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

  @Public()
  @Post('login')
  async login(@Body('token') token): Promise<User> {
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
