import { Rule } from '../entities/rule.entity';

export type FindAllOutput = {
  result: Rule[];
  total: number;
};
