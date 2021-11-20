import { Injectable, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { USER_REPOSITORY } from '../../core/constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(user): Promise<User> {
    return await this.userRepository.create<User>(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { id } });
  }

  async findOneByUUID(uuid: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { uuid } });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll<User>({
      attributes: { exclude: ['password'] },
      order: [['id', 'DESC']],
    });
  }

  async bulkInsert(users): Promise<User[]> {
    return await this.userRepository.bulkCreate<User>(users);
  }

  async updateUser(uuid:string, user) {
    const [numberOfAffectedRows, [updatedUser]] =
      await this.userRepository.update(
        { ...user },
        { where: { uuid }, returning: true },
      );
    return { numberOfAffectedRows, updatedUser };
  }

  async deactivateUser(uuid:string) {
    const status = false;
    const [numberOfAffectedRows] = await this.userRepository.update(
      { status },
      { where: { uuid }, returning: true },
    );
    return { numberOfAffectedRows };
  }

  async deleteUser(uuid:string) {
    return await this.userRepository.destroy({ where: { uuid } });
  }
}
