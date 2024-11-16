import { IsDate, IsNotEmpty, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { IsOneDayRange } from '../validators/day-range.validator';

export class DayRangeDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  beginDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @Validate(IsOneDayRange, {
    message:
      'The time range between beginDate and endDate must not exceed one day.',
  })
  isValidRange: boolean;
}
