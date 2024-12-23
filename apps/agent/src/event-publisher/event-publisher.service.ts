import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventGeneratorService } from './event-generator.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventPublisherService implements OnModuleInit {
  private agentId: string;
  private eventGenerationDuration: number;

  constructor(
    private readonly eventGeneratorService: EventGeneratorService,
    @Inject('RABBITMQ') private client: ClientProxy,
    private configService: ConfigService,
  ) {
    this.agentId = this.configService.get<string>('agentId');
    this.eventGenerationDuration = this.configService.get<number>(
      'eventGenerationDuration',
    );
  }

  async publishMessage() {
    const event = this.eventGeneratorService.generateEvent();
    const data = { agentId: this.agentId, event };

    this.client.emit<string>('RABBITMQ', JSON.stringify(data));
    console.log('Event published:', data);
  }

  onModuleInit() {
    setInterval(() => {
      this.publishMessage();
    }, this.eventGenerationDuration);
  }
}
