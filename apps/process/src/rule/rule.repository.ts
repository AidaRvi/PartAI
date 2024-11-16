import { Injectable } from '@nestjs/common';
import { DataSource, MongoRepository } from 'typeorm';
import { Rule } from './entities/rule.entity';
import { CreateRuleDto } from './dto/create-rule.dto';
import { PaginationDto } from './dto/pagination.dto';
import { FindAllOutput } from './types/find-all.type';
import { ObjectId } from 'mongodb';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Injectable()
export class RuleRepository {
  private readonly ruleRepository: MongoRepository<Rule>;

  constructor(private dataSource: DataSource) {
    this.ruleRepository = this.dataSource.getMongoRepository(Rule);
  }

  async create(createRuleDto: CreateRuleDto): Promise<Rule> {
    const rule = this.ruleRepository.create(createRuleDto);
    const result = await this.ruleRepository.save(rule);
    return result;
  }

  async findAll(
    paginationData: PaginationDto,
    filter?: Pick<Rule, 'isActive'>,
  ): Promise<FindAllOutput> {
    const skip = (paginationData.page - 1) * paginationData.limit;
    const [result, total] = await this.ruleRepository.findAndCount({
      ...(filter && { where: filter }),
      skip,
      take: paginationData.limit,
    });

    return { result, total };
  }

  async count(filter: Pick<Rule, 'isActive'>): Promise<number> {
    const result = await this.ruleRepository.count(filter);
    return result;
  }

  async findOne(id: string): Promise<Rule> {
    const rule = await this.ruleRepository.findOneBy({ _id: new ObjectId(id) });
    return rule;
  }

  async update(id: string, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    const updatedRule = await this.ruleRepository.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      { $set: updateRuleDto },
      { returnDocument: 'after' },
    );

    return updatedRule.value;
  }
}
