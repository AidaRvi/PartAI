import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventConsumerController } from './event-consumer.controller';
import { Event } from './event.entity';
import { EventsService } from './event.service';
import { MatchedEventsModule } from 'src/matched-events/matched-events.module';

@Module({
  imports: [
    forwardRef(() => MatchedEventsModule),
    TypeOrmModule.forFeature([Event]),
  ],
  controllers: [EventConsumerController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
