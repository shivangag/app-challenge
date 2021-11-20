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

@Controller('restaurant')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}
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
  async addRestaurant(@Body(new ValidationPipe()) restaurant: RestaurantDto) {
    const data = await this.restaurantService.create(restaurant);
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
  ) {
    id.toString();
    // get the number of row affected and the updated restaurant
    const { numberOfAffectedRows, updatedRestaurant } =
      await this.restaurantService.updateRestaurant(id, restaurant);

    // if the number of row affected is zero, it means the post doesn't exist in our db
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException("This Restaurant doesn't exist");
    }
    // return the updated restaurant
    return updatedRestaurant;
  }
}
