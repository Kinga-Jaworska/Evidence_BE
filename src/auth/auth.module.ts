import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [UserModule, PassportModule, JwtModule],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, GoogleStrategy],
})
export class AuthModule {}
