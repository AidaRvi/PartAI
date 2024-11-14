import { IsNotEmpty, IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class CreateRuleDto {
  @IsNumber()
  @IsOptional()
  maxNameLength: number;

  @IsNumber()
  @IsOptional()
  minNameLength: number;

  @IsNumber()
  @IsOptional()
  valueLength: number;

  @IsNumber()
  @IsOptional()
  maxFirst3DigitSum: number;

  @ValidateIf(
    (o) =>
      !o.maxNameLength &&
      !o.minNameLength &&
      !o.valueLength &&
      !o.maxFirst3DigitSum,
  )
  @IsNotEmpty({
    message:
      'At least one property (maxNameLength, minNameLength, valueLength, maxFirst3DigitSum) must be provided.',
  })
  atLeastOneDefined: boolean;
}
