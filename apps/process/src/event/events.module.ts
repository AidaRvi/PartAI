import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventConsumerController } from './event-consumer.controller';
import { Event } from './event.entity';
import { EventsService } from './event.service';
import { MatchedEventsModule } from 'src/matched-events/matched-events.module';
import { EventRepository } from './event.repository';

@Module({
  imports: [
    forwardRef(() => MatchedEventsModule),
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [EventConsumerController],
  providers: [EventsService, EventRepository],
  exports: [EventsService],
})
export class EventsModule {}
