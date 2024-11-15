import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventsService } from './event.service';
import { EventDataDto } from './DTOs/event.dto';

@Controller()
export class EventConsumerController {
  constructor(private eventService: EventsService) {}

  @EventPattern('RABBITMQ')
  eventCosumer(@Payload() data: string) {
    console.log(`** New event recieved`);

    const eventData: EventDataDto = JSON.parse(data);
    this.eventService.saveEventToRedis(eventData);
  }
}
