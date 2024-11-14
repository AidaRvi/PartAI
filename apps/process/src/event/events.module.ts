import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventConsumerController } from './event-consumer.controller';
import { Event } from './event.entity';
import { EventsService } from './event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventConsumerController],
  providers: [EventsService],
})
export class EventsModule {}
