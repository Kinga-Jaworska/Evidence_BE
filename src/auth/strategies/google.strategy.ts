import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { VerifyCallback } from 'passport-jwt';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('HELLO');
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    };

    // done(null, user);
    return {
      accessToken,
      profile,
    };
  }
  //   async validate(accessToken: string, refreshToken: string, profile: any) {
  //     // Implement the validation logic and user retrieval based on the profile data
  //     // This method is called after successful authentication and receives the access token, refresh token, and user profile

  //     const { id, displayName, emails } = profile;

  //     // Call your AuthService to handle the user authentication and retrieval logic
  //     // const user = await this.authService.authenticateWithGoogle(
  //     //   id,
  //     //   displayName,
  //     //   emails,
  //     // );

  //     return emails; // Return the authenticated user
  //   }
}
