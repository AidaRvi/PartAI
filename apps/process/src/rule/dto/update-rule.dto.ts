import { PartialType } from '@nestjs/mapped-types';
import { CreateRuleDto } from './create-rule.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRuleDto extends PartialType(CreateRuleDto) {
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
