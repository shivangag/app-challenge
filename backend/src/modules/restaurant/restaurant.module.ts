import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { RestaurantProvider } from './restaurant.provider';
@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService, ...RestaurantProvider],
  exports: [RestaurantService],
})
export class RestaurantModule {}
