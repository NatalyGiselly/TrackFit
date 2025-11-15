import { ValidationError } from '../errors/error-types';
import { ERROR_MESSAGES } from '../../constants/error-messages';
import { VALIDATION_RULES, COMMON_PASSWORDS } from '../../constants/validation-rules';

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export type PasswordValidationResult = {
  isValid: boolean;
  error?: string;
  strength?: PasswordStrength;
  score?: number;
};

export const passwordValidator = {
  validate(password: string, userInfo?: { email?: string; username?: string; name?: string }): PasswordValidationResult {
    if (!password || password.length === 0) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.required,
      };
    }

    if (password.length < VALIDATION_RULES.password.minLength) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.passwordTooShort,
      };
    }

    if (password.length > VALIDATION_RULES.password.maxLength) {
      return {
        isValid: false,
        error: 'Senha muito longa',
      };
    }

    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.passwordCommon,
      };
    }

    if (VALIDATION_RULES.password.requireUppercase && !/[A-Z]/.test(password)) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.passwordMissingUppercase,
      };
    }

    if (VALIDATION_RULES.password.requireLowercase && !/[a-z]/.test(password)) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.passwordMissingLowercase,
      };
    }

    if (VALIDATION_RULES.password.requireNumber && !/[0-9]/.test(password)) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.passwordMissingNumber,
      };
    }

    if (VALIDATION_RULES.password.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.passwordMissingSpecial,
      };
    }

    if (userInfo) {
      const lowerPassword = password.toLowerCase();
      if (
        (userInfo.email && lowerPassword.includes(userInfo.email.split('@')[0].toLowerCase())) ||
        (userInfo.username && lowerPassword.includes(userInfo.username.toLowerCase())) ||
        (userInfo.name && lowerPassword.includes(userInfo.name.toLowerCase()))
      ) {
        return {
          isValid: false,
          error: 'Senha não pode conter informações pessoais',
        };
      }
    }

    const entropy = this.calculateEntropy(password);
    if (entropy < VALIDATION_RULES.password.minEntropy) {
      return {
        isValid: false,
        error: ERROR_MESSAGES.validation.passwordTooWeak,
      };
    }

    const strength = this.calculateStrength(password, entropy);
    const score = this.calculateScore(password, entropy);

    return {
      isValid: true,
      strength,
      score,
    };
  },

  calculateEntropy(password: string): number {
    let charsetSize = 0;

    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) charsetSize += 32;

    return password.length * Math.log2(charsetSize);
  },

  calculateStrength(password: string, entropy: number): PasswordStrength {
    if (entropy < 40) return 'weak';
    if (entropy < 60) return 'fair';
    if (entropy < 80) return 'good';
    return 'strong';
  },

  calculateScore(password: string, entropy: number): number {
    let score = 0;

    score += Math.min(password.length * 4, 40);

    if (/[A-Z]/.test(password)) score += 10;
    if (/[a-z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

    score += Math.min(entropy / 2, 25);

    const uniqueChars = new Set(password).size;
    score += Math.min(uniqueChars * 2, 20);

    return Math.min(score, 100);
  },

  validateOrThrow(password: string, userInfo?: { email?: string; username?: string; name?: string }): void {
    const result = this.validate(password, userInfo);
    if (!result.isValid) {
      throw new ValidationError(result.error!, 'password');
    }
  },
};
