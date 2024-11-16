import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventPublisherService } from './event-publisher.service';
import { EventGeneratorService } from './event-generator.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.url')],
            queue: configService.get<string>('rabbitmq.queue'),
            queueOptions: {
              durable: true,
            },
            noAck: true,
          },
        }),
      },
    ]),
  ],
  providers: [EventPublisherService, EventGeneratorService],
  exports: [],
})
export class EventPublisherModule {}
