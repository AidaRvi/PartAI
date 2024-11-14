import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Rule } from './entities/rule.entity';

@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  create(@Body() createRuleDto: CreateRuleDto): Promise<Rule> {
    return this.ruleService.create(createRuleDto);
  }

  @Get()
  findAll(): Promise<Rule[]> {
    return this.ruleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Rule> {
    return this.ruleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRuleDto: UpdateRuleDto,
  ): Promise<Rule> {
    return this.ruleService.update(id, updateRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ruleService.remove(id);
  }
}
