import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Rule } from './entities/rule.entity';
import { PaginationDto } from './dto/pagination.dto';
import { FindAllOutput } from './types/find-all.type';

@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  async create(@Body() createRuleDto: CreateRuleDto): Promise<Rule> {
    try {
      const result = await this.ruleService.createHandler(createRuleDto);
      return result;
    } catch (e) {
      throw e;
    }
  }

  @Get()
  async findAll(
    @Query() paginationData: PaginationDto,
  ): Promise<FindAllOutput> {
    try {
      const result = await this.ruleService.findAllHandler(paginationData);
      return result;
    } catch (e) {
      throw e;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Rule> {
    try {
      const result = await this.ruleService.findOneHandler(id);
      return result;
    } catch (e) {
      throw e;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRuleDto: UpdateRuleDto,
  ): Promise<Rule> {
    try {
      const result = await this.ruleService.updateHandler(id, updateRuleDto);
      return result;
    } catch (e) {
      throw e;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const result = await this.ruleService.removeHandler(id);
      return result;
    } catch (e) {
      throw e;
    }
  }
}
