import { Module } from '@nestjs/common';
import { EventsModule } from './event/events.module';
import { Event } from './event/event.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuleModule } from './rule/rule.module';
import configurations from './config/configurations';
import { Rule } from './rule/entities/rule.entity';
import { MatchedEventsModule } from './matched-events/matched-events.module';
import { MatchedEvent } from './matched-events/entities/matched-event.entity';

@Module({
  imports: [
    EventsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        host: configService.get<string>('database.url'),
        port: configService.get<number>('database.port'),
        database: configService.get<string>('database.name'),
        useUnifiedTopology: true,
        entities: [Event, Rule, MatchedEvent],
        synchronize: true,
      }),
    }),
    RuleModule,
    MatchedEventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
