import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EventPublisherService implements OnModuleInit {
  constructor(@Inject('RABBITMQ') private client: ClientProxy) {}

  async publishMessage() {
    setInterval(() => {
      const event = { data: 'salam' };

      console.log('Publishing event:', event);
      this.client.emit<string>('RABBITMQ', JSON.stringify(event));
    }, 5000);
  }

  onModuleInit() {
    this.publishMessage();
  }
}
