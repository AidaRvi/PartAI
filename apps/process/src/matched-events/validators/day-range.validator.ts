import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsOneDayRange implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const endDate = args.object['endDate'] as Date;
    const beginDate = args.object['beginDate'] as Date;
    if (!beginDate || !endDate) {
      return false;
    }

    const differenceInMs = endDate.getTime() - beginDate.getTime();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    return differenceInMs <= oneDayInMs;
  }
}
