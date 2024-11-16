import { Injectable } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Rule } from './entities/rule.entity';
import { PaginationDto } from './dto/pagination.dto';
import { FindAllOutput } from './types/find-all.type';
import { RedisService } from 'src/redis/redis.service';
import { RuleRepository } from './rule.repository';

@Injectable()
export class RuleService {
  constructor(
    private readonly ruleRepository: RuleRepository,
    private readonly redisService: RedisService,
  ) {}
  async createHandler(createRuleDto: CreateRuleDto): Promise<Rule> {
    const result = await this.ruleRepository.create(createRuleDto);

    this.updateRulesInRedis();
    return result;
  }

  async findAllHandler(
    paginationData: PaginationDto,
    filter?: Pick<Rule, 'isActive'>,
  ): Promise<FindAllOutput> {
    const result = await this.ruleRepository.findAll(paginationData, filter);

    return result;
  }

  async countHandler(filter: Pick<Rule, 'isActive'>): Promise<number> {
    const result = await this.ruleRepository.count(filter);
    return result;
  }

  async findOneHandler(id: string): Promise<Rule> {
    const rule = await this.ruleRepository.findOne(id);
    return rule;
  }

  async updateHandler(id: string, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    const rule = await this.findOneHandler(id);
    if (!rule) throw new Error('rule not found');

    const newRule = await this.ruleRepository.update(id, updateRuleDto);

    this.updateRulesInRedis();

    return newRule;
  }

  async removeHandler(id: string): Promise<void> {
    const rule = await this.findOneHandler(id);
    if (!rule) throw new Error('rule not found');

    await this.ruleRepository.update(id, { isActive: false });

    this.updateRulesInRedis();
  }

  async updateRulesInRedis(): Promise<void> {
    const activeRulesCount = await this.countHandler({ isActive: true });
    const activeRules = await this.findAllHandler(
      {
        limit: activeRulesCount,
        page: 1,
      },
      { isActive: true },
    );

    await this.redisService.del('rules');
    this.redisService.set('rules', JSON.stringify(activeRules.result));
  }
}
