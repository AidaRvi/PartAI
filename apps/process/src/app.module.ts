import { Module } from '@nestjs/common';
import { EventConsumerModule } from './event-consumer/event-consumer.module';

@Module({
  imports: [EventConsumerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
