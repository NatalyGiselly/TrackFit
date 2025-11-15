import { useState, useCallback } from 'react';
import { emailValidator } from '../services/validation/email-validator';
import { passwordValidator } from '../services/validation/password-validator';
import { usernameValidator } from '../services/validation/username-validator';

type ValidationErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  name?: string;
};

export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = useCallback((email: string): boolean => {
    const result = emailValidator.validate(email);
    setErrors((prev) => ({
      ...prev,
      email: result.isValid ? undefined : result.error,
    }));
    return result.isValid;
  }, []);

  const validatePassword = useCallback(
    (password: string, userInfo?: { email?: string; username?: string; name?: string }): boolean => {
      const result = passwordValidator.validate(password, userInfo);
      setErrors((prev) => ({
        ...prev,
        password: result.isValid ? undefined : result.error,
      }));
      return result.isValid;
    },
    []
  );

  const validateConfirmPassword = useCallback((password: string, confirmPassword: string): boolean => {
    const isValid = password === confirmPassword;
    setErrors((prev) => ({
      ...prev,
      confirmPassword: isValid ? undefined : 'As senhas não coincidem',
    }));
    return isValid;
  }, []);

  const validateUsername = useCallback((username: string): boolean => {
    const result = usernameValidator.validate(username);
    setErrors((prev) => ({
      ...prev,
      username: result.isValid ? undefined : result.error,
    }));
    return result.isValid;
  }, []);

  const validateName = useCallback((name: string): boolean => {
    const trimmed = name.trim();
    let error: string | undefined;

    if (trimmed.length === 0) {
      error = 'Nome é obrigatório';
    } else if (trimmed.length < 2) {
      error = 'Nome deve ter pelo menos 2 caracteres';
    } else if (trimmed.length > 50) {
      error = 'Nome deve ter no máximo 50 caracteres';
    }

    setErrors((prev) => ({
      ...prev,
      name: error,
    }));

    return !error;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearError = useCallback((field: keyof ValidationErrors) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  }, []);

  return {
    errors,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateUsername,
    validateName,
    clearErrors,
    clearError,
  };
}
