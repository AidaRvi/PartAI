import { Module } from '@nestjs/common';
import { MatchedEventsService } from './matched-events.service';
import { MatchedEventsController } from './matched-events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchedEvent } from './entities/matched-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchedEvent])],
  controllers: [MatchedEventsController],
  providers: [MatchedEventsService],
})
export class MatchedEventsModule {}
