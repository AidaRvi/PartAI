import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventsService } from './event.service';
import { EventDataDto } from './DTOs/event.dto';

@Controller()
export class EventConsumerController {
  constructor(private eventService: EventsService) {}

  @EventPattern('RABBITMQ')
  handleMessageCreated(@Payload() data: string) {
    console.log(`Received event:`);
    const eventData: EventDataDto = JSON.parse(data);
    console.log(eventData);

    this.eventService.saveEvents(eventData);
  }
}
