import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { RuleRepository } from './rule.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Rule])],
  controllers: [RuleController],
  providers: [RuleService, RuleRepository],
  exports: [RuleService],
})
export class RuleModule {}
