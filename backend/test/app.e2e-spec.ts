import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserService } from '../src/modules/user/user.service';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const userService = {
    findAll: () => [],
    findOneByUUID: () => [],
    findOneByEmail: () => [],
    deleteUser: () => [],
    createUser: () => [],
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(UserService)
      .useValue(userService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  /*
  it('Create User (POST)', () => {
     let user = {
       name: "Test 6",
       email: "test6@gmail.com",
       password: '$2b$10$tUzfC/jmTsa..tpnFX0iEusQrCIsfxOFfeVUpsC/VW9HDQ6KqTWIy',
       phoneNumber: "8768575888",
       uuid: "bedc47d1-c778-43fd-8c07-78b05aacadb7",
       status: true
    }
     return request(app.getHttpServer())
       .post('/auth/signup')
       .send(user)
       .expect(200)
       .expect(userService.createUser());
   });
*/

  it('Get All Users (GET)', () => {
    return request(app.getHttpServer())
      .get('/user/all')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(200)
      .expect(userService.findAll());
  });

  it('Find User By Email (GET)', () => {
    return request(app.getHttpServer())
      .get('/user/test5@gmail.com')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(200)
      .expect(userService.findOneByEmail);
  });

  it('Delete User By Uuid (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/user/delete/bedc47d1-c778-43fd-8c07-78b05aacadb7')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .expect(200)
      .expect(userService.deleteUser);
  });

  afterAll(async () => {
    await app.close();
  });
});
