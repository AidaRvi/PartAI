import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async appendToList(key: string, value: string): Promise<number> {
    return this.redisClient.rpush(key, value);
  }

  async get(key: string): Promise<string[]> {
    return this.redisClient.lrange(key, 0, -1);
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }
}
