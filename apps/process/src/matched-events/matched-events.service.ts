import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventDataDto } from 'src/event/DTOs/event.dto';
import { EventsService } from 'src/event/event.service';
import { RedisService } from 'src/redis/redis.service';
import { Rule } from 'src/rule/entities/rule.entity';
import { ObjectId } from 'mongodb';
import { DayRangeDto } from './DTOs/get-timestamps-day-range.dto';
import { GetTimestampsDto } from './DTOs/get-timestamps.dto';
import { RuleService } from 'src/rule/rule.service';
import { GetAgentsDto } from './DTOs/get-agents.dto';
import { MatchedEventsRepository } from './matched-events.repository';

@Injectable()
export class MatchedEventsService {
  constructor(
    @Inject(forwardRef(() => EventsService))
    private readonly eventService: EventsService,
    @Inject(forwardRef(() => RuleService))
    private readonly ruleService: RuleService,
    private readonly redisService: RedisService,
    private readonly matchedEventRepository: MatchedEventsRepository,
  ) {}

  async compareEventsHandler(eventsData: EventDataDto[]) {
    const rules = await this.getRulesFromRedis();
    if (!rules.length) {
      console.log('There are no rules in redis'); // TODO: handle missed events
      return;
    }

    const matchedEventsAndRules: {
      ruleId: string;
      eventName: string;
      eventValue: string;
    }[] = rules.flatMap((rule) => {
      const matchedEvents = eventsData.filter((eventData) =>
        this.areEventAndRuleMatched(rule, eventData),
      );

      const matchedEventsAndRule = matchedEvents.map((event) => ({
        eventName: event.event.name,
        eventValue: event.event.value,
        ruleId: rule.id as unknown as string,
      }));

      return matchedEventsAndRule;
    });

    if (!matchedEventsAndRules.length) {
      console.log('===> No new matches');
      return;
    }

    const promisifiedEvents = matchedEventsAndRules.map(async (event) =>
      this.eventService.getEvent({
        name: event.eventName,
        value: event.eventValue,
      }),
    );

    const matchedEventsData = await Promise.all(promisifiedEvents);

    const matchedData = matchedEventsData.map((event, index) => ({
      eventId: event.id,
      ruleId: new ObjectId(matchedEventsAndRules[index].ruleId),
      agentId: event.agentId,
    }));

    this.matchedEventRepository.saveMatchedEventsAndRules(matchedData);
  }

  areEventAndRuleMatched(rule: Rule, eventData: EventDataDto): boolean {
    const eventValueLength = eventData.event.value.length;
    const eventNameLength = eventData.event.name.length;
    const eventFirst3Digit = eventData.event.value.split('.')[0];
    const eventFirst3DigitSum = [...eventFirst3Digit].reduce(
      (sum, digit) => sum + +digit,
      0,
    );

    const con1 =
      rule.maxFirst3DigitSum && rule.maxFirst3DigitSum > eventFirst3DigitSum;
    const con2 = rule.maxNameLength && rule.maxNameLength > eventNameLength;
    const con3 = rule.minNameLength && rule.minNameLength < eventNameLength;
    const con4 = rule.valueLength && rule.valueLength == eventValueLength;

    if (
      (con1 === undefined || con1) &&
      (con2 === undefined || con2) &&
      (con3 === undefined || con3) &&
      (con4 === undefined || con4)
    )
      return true;
    else return false;
  }

  async getRulesFromRedis(): Promise<Rule[]> {
    const stringifiedRules = await this.redisService.get('rules');
    const rules = JSON.parse(stringifiedRules);
    return rules;
  }

  async getTimestampsHandler(
    ruleId: string,
    getTimestampsDto: DayRangeDto,
  ): Promise<GetTimestampsDto> {
    const rule = await this.ruleService.findOne(ruleId);
    if (!rule) throw new Error('rule not found');

    const agentsData = await this.matchedEventRepository.getAgentsDatesByRule(
      ruleId,
      getTimestampsDto,
    );

    const agents = agentsData.map((agent) => ({
      [`${agent._id}`]: agent.dates,
    }));

    const result = Object.assign({}, ...agents);
    return { result };
  }

  async getAgentsHandler(ruleId: string): Promise<GetAgentsDto> {
    const rule = await this.ruleService.findOne(ruleId);
    if (!rule) throw new Error('rule not found');

    const agentsData =
      await this.matchedEventRepository.getAgentsDatesByRule(ruleId);

    const agentsCount = agentsData.map((agentData) => ({
      agentId: agentData._id,
      count: agentData.dates.length,
    }));

    const result = agentsCount
      .sort((a, b) => b.count - a.count)
      .map((item) => item.agentId);

    return { result };
  }
}
