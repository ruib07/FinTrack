import { ValidationError } from "../errors/validation.error.js";

export const passwordRegexPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-_])[A-Za-z\d@$!%*?&\-_]{9,}$/;

export class PasswordValidator {
  static validate(password: string) {
    if (!passwordRegexPattern.test(password)) {
      throw new ValidationError(
        "Password must have at least 9 characters, one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
      );
    }
  }
}
