import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProvider } from './user.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, ...UserProvider],
  exports: [UserService],
})
export class UserModule {}
