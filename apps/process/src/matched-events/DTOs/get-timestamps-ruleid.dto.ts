import { IsMongoId } from 'class-validator';

export class RuleIdDto {
  @IsMongoId()
  ruleId: string;
}
