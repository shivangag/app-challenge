import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { UserController } from './user.controller';

describe('UserService', () => {
  let userService: UserService;
  let userController: UserController;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: UserService,
      useFactory: () => ({
        findAll: jest.fn(() => []),
        create: jest.fn(() => []),
        findOneByEmail: jest.fn(() => []),
        deleteUser: jest.fn(() => []),
        deactivateUser: jest.fn(() => []),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, ApiServiceProvider],
      controllers: [UserController],
    }).compile();

    userService = module.get(UserService);
    userController = module.get(UserController);
  });

  it('Create User Method', () => {
    const dto = new UserDto();
    expect(userService.create(dto)).not.toEqual(null);
  });

  it('Get All Users Method', () => {
    userController.getUsers();
    expect(userService.findAll).toHaveBeenCalled();
  });

  it('findByEmail Method', () => {
    const email = 'test5@gmail.com';
    userController.findOneByEmail(email);
    expect(userService.findOneByEmail).toHaveBeenCalled();
  });

  it('Delete User Method', () => {
    const uuid = 'bedc47d1-c778-43fd-8c07-78b05aacadb7';
    userController.deleteUser(uuid);
    expect(userService.deleteUser).toHaveBeenCalled();
  });

  it('Deactivate User Method', () => {
    const uuid = 'bedc47d1-c778-43fd-8c07-78b05aacadb7';
    userController.deactivateUser(uuid);
    expect(userService.deactivateUser).toHaveBeenCalled();
  });

});
