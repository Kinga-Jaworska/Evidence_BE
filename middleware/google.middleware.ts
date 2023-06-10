import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoginTicket, OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const bearerToken = req.headers.authorization;

      if (!bearerToken) {
        throw new UnauthorizedException('Missing bearer token');
      }

      const token = bearerToken.replace('Bearer ', '');

      const ticket: LoginTicket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      req.user = ticket.getPayload();

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid bearer token');
    }
  }
}
