import { Module } from '@nestjs/common';
import { EventPublisherModule } from './event-publisher/event-publisher.module';
import { ConfigModule } from '@nestjs/config';
import configurations from './config/configurations';

@Module({
  imports: [
    EventPublisherModule,
    ConfigModule.forRoot({
      load: [configurations],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
