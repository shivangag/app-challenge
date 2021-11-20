import { Injectable, Inject } from '@nestjs/common';
import { Restaurant } from './restaurant.entity';
import { RESTAURANT_REPOSITORY } from '../../core/constants';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restuarantRepository: typeof Restaurant,
  ) {}

  async create(restaurant): Promise<Restaurant> {
    return await this.restuarantRepository.create<Restaurant>(restaurant);
  }

  async findOneById(id: number): Promise<Restaurant> {
    return await this.restuarantRepository.findOne<Restaurant>({
      where: { id },
    });
  }

  async findAll(users): Promise<Restaurant[]> {
    return await this.restuarantRepository.findAll<Restaurant>(users);
  }

  async bulkInsert(restaurants): Promise<Restaurant[]> {
    return await this.restuarantRepository.bulkCreate<Restaurant>(restaurants);
  }

  async deleteRestaurant(id) {
    return await this.restuarantRepository.destroy({ where: { id } });
  }

  async updateRestaurant(id, restaurant) {
    const [numberOfAffectedRows, [updatedRestaurant]] =
      await this.restuarantRepository.update(
        { ...restaurant },
        { where: { id }, returning: true },
      );
    return { numberOfAffectedRows, updatedRestaurant };
  }
}
