import { Module, Global } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const redis = new Redis({
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        });
        return redis;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
