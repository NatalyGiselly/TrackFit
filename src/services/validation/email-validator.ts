import { z } from 'zod';
import { ValidationError } from '../errors/error-types';
import { ERROR_MESSAGES } from '../../constants/error-messages';
import { VALIDATION_RULES } from '../../constants/validation-rules';

const emailSchema = z.string().email();

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export const emailValidator = {
  validate(email: string): ValidationResult {
    if (!email || email.trim().length === 0) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.required,
      };
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail.length < VALIDATION_RULES.email.minLength) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.invalidEmail,
      };
    }

    if (trimmedEmail.length > VALIDATION_RULES.email.maxLength) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.invalidEmail,
      };
    }

    const zodResult = emailSchema.safeParse(trimmedEmail);
    if (!zodResult.success) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.invalidEmail,
      };
    }

    if (!VALIDATION_RULES.email.pattern.test(trimmedEmail)) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.invalidEmail,
      };
    }

    return { isValid: true };
  },

  normalize(email: string): string {
    return email.trim().toLowerCase();
  },

  validateOrThrow(email: string): string {
    const result = this.validate(email);
    if (!result.isValid) {
      throw new ValidationError(result.error!, 'email');
    }
    return this.normalize(email);
  },
};
