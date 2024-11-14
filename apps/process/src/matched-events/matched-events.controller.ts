import { Controller, Get } from '@nestjs/common';
import { MatchedEventsService } from './matched-events.service';

@Controller('matched-events')
export class MatchedEventsController {
  constructor(private readonly matchedEventsService: MatchedEventsService) {}

  @Get()
  findAll() {
    return this.matchedEventsService.findAll();
  }
}
