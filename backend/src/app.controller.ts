import { Controller, Get, Post } from '@nestjs/common';

import { ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

//@ApiBearerAuth()
@Controller('/challenge')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'challenge description' })
  getChallenge(): string {
    return this.appService.getChallenge();
  }

  @Post()
  @ApiResponse({ status: 200, description: 'challenge description' })
  getHelloChallenge(): string {
    return this.appService.getHelloChallenge();
  }
}
