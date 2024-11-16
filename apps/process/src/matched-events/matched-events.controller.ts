import { Controller, Get, Param, Query } from '@nestjs/common';
import { MatchedEventsService } from './matched-events.service';
import { DayRangeDto } from './DTOs/get-timestamps-day-range.dto';
import { GetTimestampsDto } from './DTOs/get-timestamps.dto';
import { RuleIdDto } from './DTOs/get-timestamps-ruleid.dto';

@Controller('matched-events')
export class MatchedEventsController {
  constructor(private readonly matchedEventsService: MatchedEventsService) {}

  @Get('rules/:ruleId/timestamps')
  getTimestamps(
    @Param() ruleIdDto: RuleIdDto,
    @Query() getTimestampsDto: DayRangeDto,
  ): Promise<GetTimestampsDto> {
    return this.matchedEventsService.getTimestampsHandler(
      ruleIdDto.ruleId,
      getTimestampsDto,
    );
  }

  // @Get('rules/:ruleId/agents')
  // getAgents() {}
}
