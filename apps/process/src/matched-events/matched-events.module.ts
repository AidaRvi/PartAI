import { forwardRef, Module } from '@nestjs/common';
import { MatchedEventsService } from './matched-events.service';
import { MatchedEventsController } from './matched-events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchedEvent } from './entities/matched-event.entity';
import { EventsModule } from 'src/event/events.module';

@Module({
  imports: [
    forwardRef(() => EventsModule),
    TypeOrmModule.forFeature([MatchedEvent]),
  ],
  controllers: [MatchedEventsController],
  providers: [MatchedEventsService],
  exports: [MatchedEventsService],
})
export class MatchedEventsModule {}
