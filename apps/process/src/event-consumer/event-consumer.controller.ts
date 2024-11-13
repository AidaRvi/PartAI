import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class EventConsumerController {
  @EventPattern('RABBITMQ')
  handleMessageCreated(@Payload() data: any) {
    console.log(`Received event:`);
    console.log(JSON.parse(data));
  }
}
