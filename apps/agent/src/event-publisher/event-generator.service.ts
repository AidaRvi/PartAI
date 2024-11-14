import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

@Injectable()
export class EventGeneratorService {
  generateEvent() {
    const event = {
      title: faker.internet.domainName(),
      value: faker.internet.ipv4(),
    };
    return event;
  }
}
