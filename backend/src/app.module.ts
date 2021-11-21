import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';

import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './core/database/database.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    RestaurantModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
