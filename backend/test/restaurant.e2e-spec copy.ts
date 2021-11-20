import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RestaurantService } from '../src/modules/restaurant/restaurant.service';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

//import { RestaurantDto } from '../src/modules/restaurant/dto/restaurant.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const restaurantService = {
    findAll: () => [],
    create: () => [],
    deleteRestaurant: () => [],
  };
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RestaurantService)
      .useValue(restaurantService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Create Restaurant (POST)', () => {
    const restaurant = {
      name: 'CBL test',
      address: 'Chandigarh',
      lat: '30.766',
      long: '76.311',
      country: 'India',
      user_id: '6',
    };
    return request(app.getHttpServer())
      .post('/v1/restaurant/add')
      .send(restaurant)
      .expect(201)
      .expect(restaurantService.create());
  });

  it('Get All Restaurant (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/restaurant/all')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(200)
      .expect(restaurantService.findAll());
  });

  it('Delete restaurant By id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/v1/restaurant/delete/1')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(200)
      .expect(restaurantService.deleteRestaurant);
  });

  afterAll(async () => {
    await app.close();
  });
});
