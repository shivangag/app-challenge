import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../../modules/user/user.entity';
import { Restaurant } from '../../modules/restaurant/restaurant.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Restaurant]);

      User.hasMany(Restaurant, { foreignKey: 'user_id' });
      Restaurant.belongsTo(User, { foreignKey: 'user_id' });

      //await sequelize.sync();
      return sequelize;
    },
  },
];
