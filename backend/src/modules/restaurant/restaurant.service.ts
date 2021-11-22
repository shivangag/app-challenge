import { Injectable, Inject } from '@nestjs/common';
import { Restaurant } from './restaurant.entity';
import { RESTAURANT_REPOSITORY } from '../../core/constants';
import { RedisService } from 'nestjs-redis';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject(RESTAURANT_REPOSITORY)
    private readonly restuarantRepository: typeof Restaurant,
    private gateway: SocketGateway,
    private cacheManager: SocketService
  ) {}


//   async setSomeValue(KEY , value){
//     await this.cacheManager.set(KEY , value);
//  }

// async getSomeValue(KEY){
//   await this.cacheManager.get(KEY);
// }

  async create(restaurant): Promise<Restaurant> {
    return await this.restuarantRepository.create<Restaurant>(restaurant);
  }

  async findOneById(id: number): Promise<Restaurant> {
    return await this.restuarantRepository.findOne<Restaurant>({
      where: { id },
    });
  }

  async findAll(users): Promise<Restaurant[]> {
    console.log("start");
    console.log(users);
    console.log("end");
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