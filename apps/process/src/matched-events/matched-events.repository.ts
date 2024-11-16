import { Injectable } from '@nestjs/common';
import { DataSource, EntityRepository, MongoRepository } from 'typeorm';
import { MatchedEvent } from './entities/matched-event.entity';
import { ObjectId } from 'mongodb';
import { DayRangeDto } from './DTOs/get-timestamps-day-range.dto';

@Injectable()
export class MatchedEventsRepository {
  private readonly matchedEventsRepository: MongoRepository<MatchedEvent>;

  constructor(private dataSource: DataSource) {
    this.matchedEventsRepository =
      this.dataSource.getMongoRepository(MatchedEvent);
  }

  async saveMatchedEventsAndRules(
    data: Pick<MatchedEvent, 'agentId' | 'eventId' | 'ruleId'>[],
  ): Promise<void> {
    const enrichedData = data.map((event) => ({
      ...event,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    this.matchedEventsRepository.insertMany(enrichedData);
  }

  async getAgentsDatesByRule(
    ruleId: string,
    getTimestampsDto?: DayRangeDto,
  ): Promise<{ _id: string; dates: Date[] }[]> {
    const beginDate = getTimestampsDto?.beginDate;
    const endDate = getTimestampsDto?.endDate;

    const pipeline = [
      {
        $match: {
          ...(getTimestampsDto && {
            createdAt: { $gte: beginDate, $lte: endDate },
          }),
          ruleId: new ObjectId(ruleId),
        },
      },
      {
        $project: {
          agentId: 1,
          createdAt: 1,
          _id: 0,
        },
      },
      {
        $group: {
          _id: '$agentId',
          dates: { $push: '$createdAt' },
        },
      },
    ];

    const agentsData = (await this.matchedEventsRepository
      .aggregate(pipeline)
      .toArray()) as unknown as { _id: string; dates: Date[] }[];

    return agentsData;
  }
}
