import { forwardRef, Module } from '@nestjs/common';
import { MatchedEventsService } from './matched-events.service';
import { MatchedEventsController } from './matched-events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from 'src/event/events.module';
import { RuleModule } from 'src/rule/rule.module';
import { MatchedEventsRepository } from './matched-events.repository';
import { MatchedEvent } from './entities/matched-event.entity';

@Module({
  imports: [
    forwardRef(() => EventsModule),
    RuleModule,
    TypeOrmModule.forFeature([MatchedEvent]),
  ],
  controllers: [MatchedEventsController],
  providers: [MatchedEventsService, MatchedEventsRepository],
  exports: [MatchedEventsService],
})
export class MatchedEventsModule {}
