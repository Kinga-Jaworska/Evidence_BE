// import {
//   Body,
//   Controller,
//   Get,
//   HttpCode,
//   Post,
//   UseGuards,
// } from '@nestjs/common';
// import { HttpStatus } from '@nestjs/common/enums';
// import { AuthGuard } from '@nestjs/passport';
// import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
// import { AuthService } from './auth.service';
// import { LoginUserDTO } from './dto/login-user.dto';
// import { RegisterUserDTO } from './dto/register-user.dto';
// import { Tokens } from './types';

// @Controller('api/v1/auth')
// export class AuthController {
//   constructor(private authService: AuthService) {}

//   @Get('protected')
//   getProtectedTest(@GetCurrentUserId() userId: number) {
//     return userId;
//   }

//   @Public()
//   @Post('register')
//   @HttpCode(HttpStatus.CREATED)
//   async register(@Body() userDTO: RegisterUserDTO): Promise<Tokens> {
//     const tokens = await this.authService.register(userDTO);
//     return tokens;
//   }

//   @Public()
//   @Post('login')
//   @HttpCode(HttpStatus.OK)
//   async login(@Body() userDTO: LoginUserDTO): Promise<Tokens> {
//     const token = await this.authService.login(userDTO);
//     return token;
//   }

//   @Post('logout')
//   @HttpCode(HttpStatus.OK)
//   logOut(@GetCurrentUserId() userId: number) {
//     return this.authService.logout(userId);
//   }

//   @Public()
//   @UseGuards(AuthGuard('jwt-refresh'))
//   @Post('auth/refresh')
//   @HttpCode(HttpStatus.OK)
//   async refresh(
//     @GetCurrentUserId() userId: number,
//     @GetCurrentUser('refreshToken') refreshToken: string,
//   ) {
//     return this.authService.refreshToken(userId, refreshToken);
//   }
// }
