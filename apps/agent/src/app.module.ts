import { Module } from '@nestjs/common';
import { EventPublisherModule } from './event-publisher/event-publisher.module';

@Module({
  imports: [EventPublisherModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
