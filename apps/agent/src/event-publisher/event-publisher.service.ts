import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventGeneratorService } from './event-generator.service';

@Injectable()
export class EventPublisherService implements OnModuleInit {
  constructor(
    private readonly eventGeneratorService: EventGeneratorService,
    @Inject('RABBITMQ') private client: ClientProxy,
  ) {}

  async publishMessage() {
    const event = this.eventGeneratorService.generateEvent();

    this.client.emit<string>('RABBITMQ', JSON.stringify(event));
    console.log('Event published:', event);
  }

  onModuleInit() {
    setInterval(() => {
      this.publishMessage();
    }, 500);
  }
}
