import {
  Controller,
  Body,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserDto, loginDto } from '../user/dto/user.dto';
import { DoesUserExist } from '../../core/guards/doesUserExist.guard';
import { SentryInterceptor } from '../../core/interceptor/sentry.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseInterceptors(SentryInterceptor)
  async login(@Body(new ValidationPipe()) payload: loginDto) {
    const data = await this.authService.login(payload);
    return data;
  }

  @UseGuards(DoesUserExist)
  @Post('signup')
  @UseInterceptors(SentryInterceptor)
  async signUp(@Body(new ValidationPipe()) user: UserDto) {
    const data = await this.authService.create(user);
    return data;
  }
}
