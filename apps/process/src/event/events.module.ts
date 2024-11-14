import { Module } from '@nestjs/common';
import { EventConsumerController } from './event-consumer.controller';

@Module({
  imports: [],
  controllers: [EventConsumerController],
  providers: [],
})
export class EventsModule {}
