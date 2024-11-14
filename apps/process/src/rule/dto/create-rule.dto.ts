import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRuleDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}
