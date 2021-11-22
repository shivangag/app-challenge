import {
  Controller,
  UseGuards,
  Get,
  Post,
  Param,
  Put,
  Delete,
  Body,
  NotFoundException,
  UseInterceptors,
  ValidationPipe,
  Header,
  Request,
  createParamDecorator,
} from '@nestjs/common';
import { SentryInterceptor } from '../../core/interceptor/sentry.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import {
  RestaurantDto,
  editRestaurantDto,
} from '../restaurant/dto/restaurant.dto';

import { RestaurantService } from './restaurant.service';
import { User } from '../../modules/user/user.entity';
import { SocketGateway } from '../socket/socket.gateway';
import { AuthUser } from './temp';
//import { JwtService } from '@nestjs/jwt';

@Controller('restaurant')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService,
    private socketgateway: SocketGateway) {}
  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(SentryInterceptor)
  @ApiResponse({ status: 200, description: 'Get Restaurant List' })
  @ApiBearerAuth('Authorization')
  async getRestaurants() {
    const data = await this.restaurantService.findAll({ include: User });
    if (!data) {
      throw new NotFoundException("This Resturants doesn't exist");
    } else {
      return data;
    }
  }


  
  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(SentryInterceptor)
  @ApiResponse({ status: 200, description: 'New restaurant Added' })
  @ApiBearerAuth('Authorization')
  async addRestaurant(@Body(new ValidationPipe()) restaurant: RestaurantDto, @AuthUser() user: any) {
    const data = await this.restaurantService.create(restaurant);
    console.log(user)
    await this.socketgateway.sendNotification(user.id, data);
    return data;
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(SentryInterceptor)
  @ApiResponse({ status: 200, description: 'Restaurant Deleted Success' })
  @ApiBearerAuth('Authorization')
  async deleteRestaurant(@Param('id') id: string) {
    const deleted = await this.restaurantService.deleteRestaurant(id);

    // if the number of row affected is zero, then the restaurant doesn't exist in our db
    if (deleted === 0) {
      throw new NotFoundException("This Restaurant doesn't exist");
    }

    // return success message
    return { success: true, message: 'Restaurant Deleted Success' };
  }

// update Restaurant info
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(SentryInterceptor)
  @ApiResponse({ status: 200, description: 'Restaurant update Success' })
  @ApiBearerAuth('Authorization')
  async updateRestaurant(
    @Param('id') id: number,
    @Body(new ValidationPipe()) restaurant: editRestaurantDto,
    @AuthUser() user: any
  ) {
    id.toString();
    // get the number of row affected and the updated restaurant
    const { numberOfAffectedRows, updatedRestaurant } =
      await this.restaurantService.updateRestaurant(id, restaurant);

    // if the number of row affected is zero, it means the post doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This Restaurant doesn't exist");
    }
    await this.socketgateway.sendNotification(id, updatedRestaurant);
    // return the updated restaurant
    return updatedRestaurant;
  }

  
}
