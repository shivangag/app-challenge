import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantDto } from './dto/restaurant.dto';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { SocketModule } from '../socket/socket.module';

describe('RestaurantService', () => {
  let restaurantService: RestaurantService;
  let restaurantController: RestaurantController;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: RestaurantService,
      useFactory: () => ({
        findAll: jest.fn(() => []),
        create: jest.fn(() => []),
        deleteRestaurant: jest.fn(() => []),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports:[SocketModule],
      providers: [RestaurantService, ApiServiceProvider],
      controllers: [RestaurantController],
    }).compile();

    restaurantService = module.get(RestaurantService);
    restaurantController = module.get(RestaurantController);
  });

  it('Create Restaurant Method', () => {
    const dto = new RestaurantDto();
    expect(restaurantService.create(dto)).not.toEqual(null);
  });

  it('Get All Restaurant Method', () => {
    restaurantController.getRestaurants();
    expect(restaurantService.findAll).toHaveBeenCalled();
  });

  it('Delete restaurant Method', () => {
    const id = '5';
    restaurantController.deleteRestaurant(id);
    expect(restaurantService.deleteRestaurant).toHaveBeenCalled();
  });
});
