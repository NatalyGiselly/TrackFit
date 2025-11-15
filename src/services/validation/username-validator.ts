import { ValidationError } from '../errors/error-types';
import { ERROR_MESSAGES } from '../../constants/error-messages';
import { VALIDATION_RULES, RESERVED_USERNAMES } from '../../constants/validation-rules';

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export const usernameValidator = {
  validate(username: string): ValidationResult {
    if (!username || username.trim().length === 0) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.required,
      };
    }

    const trimmedUsername = username.trim();

    if (trimmedUsername.length < VALIDATION_RULES.username.minLength) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.usernameTooShort,
      };
    }

    if (trimmedUsername.length > VALIDATION_RULES.username.maxLength) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.usernameTooLong,
      };
    }

    if (!VALIDATION_RULES.username.pattern.test(trimmedUsername)) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.invalidUsername,
      };
    }

    if (VALIDATION_RULES.username.noConsecutiveSpecialChars) {
      if (/[_-]{2,}/.test(trimmedUsername)) {
        return {
          isValid: false,
          error: 'Nome de usuário não pode ter caracteres especiais consecutivos',
        };
      }
    }

    if (trimmedUsername.startsWith('_') || trimmedUsername.startsWith('-')) {
      return {
        isValid: false,
        error: 'Nome de usuário não pode começar com caractere especial',
      };
    }

    if (trimmedUsername.endsWith('_') || trimmedUsername.endsWith('-')) {
      return {
        isValid: false,
        error: 'Nome de usuário não pode terminar com caractere especial',
      };
    }

    if (RESERVED_USERNAMES.has(trimmedUsername.toLowerCase())) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.usernameReserved,
      };
    }

    return { isValid: true };
  },

  normalize(username: string): string {
    return username.trim();
  },

  validateOrThrow(username: string): string {
    const result = this.validate(username);
    if (!result.isValid) {
      throw new ValidationError(result.error!, 'username');
    }
    return this.normalize(username);
  },
};
