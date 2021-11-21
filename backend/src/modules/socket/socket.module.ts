import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [CacheModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      store: redisStore,
      host: configService.get('localhost'),
      port: configService.get('6379'),
    })
  })],
  providers: [SocketService, SocketGateway],
  exports:[SocketService, SocketGateway]
})
export class SocketModule { }
