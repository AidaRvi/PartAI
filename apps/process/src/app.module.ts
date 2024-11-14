import { Module } from '@nestjs/common';
import { EventsModule } from './event/events.module';
import { Event } from './event/event.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configurations from './config/configurations';

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
        entities: [Event],
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
