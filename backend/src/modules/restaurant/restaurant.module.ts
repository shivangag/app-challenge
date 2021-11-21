import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { RestaurantProvider } from './restaurant.provider';
import { AppGateway } from 'src/app.gateway';
@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService, ...RestaurantProvider, AppGateway],
  exports: [RestaurantService],
})
export class RestaurantModule {}
