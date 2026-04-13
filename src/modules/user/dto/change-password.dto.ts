import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';

const PASSWORD_POLICY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;
const PASSWORD_POLICY_MESSAGE =
  'Password must be at least 10 characters, including uppercase, lowercase, numbers, and special characters.';

@ValidatorConstraint({ name: 'passwordsMatch', async: false })
class PasswordsMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments): boolean {
    const obj = args.object as ChangePasswordInput;
    return confirmPassword === obj.new_password;
  }

  defaultMessage(): string {
    return 'Passwords do not match.';
  }
}

export class ChangePasswordInput {
  @IsNotEmpty()
  @IsString()
  current_password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: PASSWORD_POLICY_MESSAGE })
  @Matches(PASSWORD_POLICY_REGEX, { message: PASSWORD_POLICY_MESSAGE })
  new_password: string;

  @IsNotEmpty()
  @IsString()
  @Validate(PasswordsMatchConstraint, {
    message: 'Passwords do not match.',
  })
  confirm_password: string;
}
