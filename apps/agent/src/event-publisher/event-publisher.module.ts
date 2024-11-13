import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventPublisherService } from './event-publisher.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'events',
          queueOptions: {
            durable: true,
          },
          noAck: true,
        },
      },
    ]),
  ],
  providers: [EventPublisherService],
  exports: [],
})
export class EventPublisherModule {}
