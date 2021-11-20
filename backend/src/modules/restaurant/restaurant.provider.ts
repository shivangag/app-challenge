import { Restaurant } from './restaurant.entity';
import { RESTAURANT_REPOSITORY } from '../../core/constants';

export const RestaurantProvider = [
  {
    provide: RESTAURANT_REPOSITORY,
    useValue: Restaurant,
  },
];
