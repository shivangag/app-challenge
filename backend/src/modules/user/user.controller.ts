import {
  Controller,
  Body,
  Get,
  Param,
  Put,
  UseGuards,
  Delete,
  NotFoundException,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { editUserDto } from './dto/user.dto';
import { SentryInterceptor } from '../../core/interceptor/sentry.interceptor';

import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(SentryInterceptor)
  @ApiResponse({ status: 200, description: 'Get users List' })
  @ApiBearerAuth('Authorization')
  async getUsers() {
    const data = await this.userService.findAll();
    if (!data) {
      throw new NotFoundException("This User doesn't exist");
    } else {
      return data;
    }
  }

  @Get(':email')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(SentryInterceptor)
  @ApiResponse({ status: 200, description: 'Get user' })
  @ApiBearerAuth('Authorization')
  async findOneByEmail(@Param('email') email: string) {
    const data = await this.userService.findOneByEmail(email);
    if (!data) {
      throw new NotFoundException("This User doesn't exist");
    } else {
      return data;
    }
  }

  @Put(':uuid')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(SentryInterceptor)
  @ApiResponse({ status: 200, description: 'User update Success' })
  @ApiBearerAuth('Authorization')
  async updateUser(
    @Param('uuid') uuid: string,
    @Body(new ValidationPipe()) user: editUserDto,
  ) {
    uuid.toString();
    // get the number of row affected and the updated user
    const { numberOfAffectedRows, updatedUser } =
      await this.userService.updateUser(uuid, user);

    // if the number of row affected is zero, it means the post doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This User doesn't exist");
    }
    // return the updated user
    return updatedUser;
  }

  @Put('deactivate/:uuid')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(SentryInterceptor)
  @ApiResponse({ status: 200, description: 'Deactivate User' })
  @ApiBearerAuth('Authorization')
  async deactivateUser(@Param('uuid') uuid: string) {
    uuid.toString();
    // get the number of row affected and the updated user
    const { numberOfAffectedRows } = await this.userService.deactivateUser(
      uuid,
    );

    // if the number of row affected is zero, it means the post doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This User doesn't exist");
    }
    // return the updated user
    return { success: true, message: 'User Deactivated' };
  }

  @Delete('delete/:uuid')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(SentryInterceptor)
  @ApiResponse({ status: 200, description: 'User Deleted Success' })
  @ApiBearerAuth('Authorization')
  async deleteUser(@Param('uuid') uuid: string) {
    // get the number of row affected and the updated user
    const deleted = await this.userService.deleteUser(uuid);

    // if the number of row affected is zero, then the user doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This User doesn't exist");
    }

    // return success message
    return { success: true, message: 'User Deleted Success' };
  }
}
