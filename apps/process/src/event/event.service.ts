import { Injectable } from '@nestjs/common';
import { EventDataDto } from './DTOs/event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async saveEvents(data: EventDataDto): Promise<void> {
    const event = this.eventRepository.create({
      agentId: data.agentId,
      name: data.event.name,
      value: data.event.value,
    });
    this.eventRepository.save(event);
  }
}
