import { Injectable } from '@nestjs/common';
import { DataSource, MongoRepository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventRepository {
  private readonly eventRepository: MongoRepository<Event>;

  constructor(private dataSource: DataSource) {
    this.eventRepository = this.dataSource.getMongoRepository(Event);
  }

  async saveEvents(
    data: Pick<Event, 'agentId' | 'name' | 'value'>[],
  ): Promise<void> {
    const enrichedData = data.map((event) => ({
      ...event,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    this.eventRepository.insertMany(enrichedData);
  }

  async getEvent(filter: Pick<Event, 'name' | 'value'>): Promise<Event> {
    const result = await this.eventRepository.findOne({ where: filter });
    return result;
  }
}
