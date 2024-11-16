import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventDataDto } from 'src/event/DTOs/event.dto';
import { EventsService } from 'src/event/event.service';
import { RedisService } from 'src/redis/redis.service';
import { Rule } from 'src/rule/entities/rule.entity';
import { MongoRepository } from 'typeorm';
import { MatchedEvent } from './entities/matched-event.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class MatchedEventsService {
  constructor(
    @Inject(forwardRef(() => EventsService))
    private readonly eventService: EventsService,
    @InjectRepository(MatchedEvent)
    private readonly matchedEventRepository: MongoRepository<MatchedEvent>,
    private readonly redisService: RedisService,
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

    // TODO: handle no matched

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

    this.saveMatchedEventsAndRules(matchedData);
    console.log(matchedData);
  }

  areEventAndRuleMatched(rule: Rule, eventData: EventDataDto): boolean {
    const eventValueLength = eventData.event.value.length;
    const eventNameLength = eventData.event.name.length;
    const eventFirst3Digit = eventData.event.value.split('.')[0];
    const eventFirst3DigitSum = [+eventFirst3Digit].reduce(
      (sum, digit) => sum + +digit,
      0,
    );

    // TODO: handle undefiend rule proprties
    if (
      rule.maxFirst3DigitSum > eventFirst3DigitSum &&
      rule.maxNameLength > eventNameLength &&
      rule.minNameLength < eventNameLength &&
      rule.valueLength == eventValueLength
    )
      return true;
    else return false;
  }

  async getRulesFromRedis(): Promise<Rule[]> {
    const stringifiedRules = await this.redisService.get('rules');
    const rules = JSON.parse(stringifiedRules);
    return rules;
  }

  async saveMatchedEventsAndRules(data: MatchedEvent[]): Promise<void> {
    this.matchedEventRepository.insertMany(data);
  }
}
