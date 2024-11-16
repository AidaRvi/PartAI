import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EventDataDto } from './DTOs/event.dto';
import { Event } from './event.entity';
import { RedisService } from 'src/redis/redis.service';
import { MatchedEventsService } from 'src/matched-events/matched-events.service';
import { EventRepository } from './event.repository';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => MatchedEventsService))
    private readonly matchedEventService: MatchedEventsService,
  ) {}

  async saveEventsHandler(
    data: Pick<Event, 'agentId' | 'name' | 'value'>[],
  ): Promise<void> {
    this.eventRepository.saveEvents(data);
  }

  async saveEventToRedis(event: EventDataDto): Promise<void> {
    this.redisService.appendToList('events', JSON.stringify(event));
  }

  async getAndDeleteEventsFromRedis(): Promise<EventDataDto[]> {
    const stringifiedEvents = await this.redisService.getList('events');
    await this.redisService.del('events');

    const eventsData = stringifiedEvents.map((event) => JSON.parse(event));
    return eventsData;
  }

  onModuleInit() {
    setInterval(() => {
      this.EventsHandler();
    }, 10000);
  }

  async EventsHandler() {
    const eventsData = await this.getAndDeleteEventsFromRedis();
    if (!eventsData.length) {
      console.log('No new events to handle');
      return;
    }

    const events: Pick<Event, 'agentId' | 'name' | 'value'>[] = eventsData.map(
      (item) => ({
        agentId: item.agentId,
        name: item.event.name,
        value: item.event.value,
      }),
    );
    await this.saveEventsHandler(events);
    this.matchedEventService.compareEventsHandler(eventsData);
  }

  async getEventHandler(filter: Pick<Event, 'name' | 'value'>): Promise<Event> {
    const result = await this.eventRepository.getEvent(filter);
    return result;
  }
}
