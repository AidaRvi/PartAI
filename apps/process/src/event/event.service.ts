import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EventDataDto } from './DTOs/event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Event } from './event.entity';
import { RedisService } from 'src/redis/redis.service';
import { MatchedEventsService } from 'src/matched-events/matched-events.service';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: MongoRepository<Event>,
    private readonly redisService: RedisService,
    @Inject(forwardRef(() => MatchedEventsService))
    private readonly matchedEventService: MatchedEventsService,
  ) {}

  async saveEvents(EventsData: EventDataDto[]): Promise<void> {
    const events: Event[] = EventsData.map((item) => ({
      agentId: item.agentId,
      name: item.event.name,
      value: item.event.value,
    }));
    await this.eventRepository.insertMany(events);
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
    await this.saveEvents(eventsData);

    this.matchedEventService.compareEventsHandler(eventsData);
  }

  async getEvent(filter: Pick<Event, 'name' | 'value'>): Promise<Event> {
    const result = await this.eventRepository.findOne({ where: filter });
    return result;
  }
}
