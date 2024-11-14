import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchedEventsService {
  findAll() {
    return `This action returns all matchedEvents`;
  }
}
