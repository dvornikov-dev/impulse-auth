import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPasswordConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsValidPassword' })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    if (!value) {
      return false;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;

    if (!passwordRegex.test(value)) {
      return false;
    }

    return true;
  }

  defaultMessage() {
    return `Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character`;
  }
}
