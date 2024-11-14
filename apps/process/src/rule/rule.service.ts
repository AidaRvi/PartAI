import { Injectable } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Rule } from './entities/rule.entity';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule)
    private readonly ruleRepository: MongoRepository<Rule>,
  ) {}
  async create(createRuleDto: CreateRuleDto): Promise<Rule> {
    const rule = this.ruleRepository.create(createRuleDto);
    const result = await this.ruleRepository.save(rule);
    return result;
  }

  async findAll(): Promise<Rule[]> {
    const rule = await this.ruleRepository.find();
    return rule;
  }

  async findOne(id: string): Promise<Rule> {
    const rule = await this.ruleRepository.findOneBy({ _id: new ObjectId(id) });
    return rule;
  }

  async update(id: string, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    const rule = await this.findOne(id);
    if (!rule) throw new Error('rule not found');

    const updatedRule = await this.ruleRepository.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      { $set: updateRuleDto },
      { returnDocument: 'after' },
    );
    return updatedRule.value;
  }

  async remove(id: string): Promise<void> {
    const rule = await this.findOne(id);
    if (!rule) throw new Error('rule not found');

    await this.ruleRepository.update(
      { id: new ObjectId(id) },
      { isActive: false },
    );
  }
}
