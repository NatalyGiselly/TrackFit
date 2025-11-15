import { hashPassword, verifyPassword } from '../../utils/crypto/hash';
import { errorLogger } from '../errors/error-logger';
import { AuthenticationError } from '../errors/error-types';

export const passwordHasher = {
  async hash(password: string): Promise<string> {
    try {
      return await hashPassword(password);
    } catch (error) {
      errorLogger.error('Failed to hash password', error as Error);
      throw new AuthenticationError('Erro ao processar senha', 'HASH_ERROR');
    }
  },

  async verify(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await verifyPassword(password, hashedPassword);
    } catch (error) {
      errorLogger.error('Failed to verify password', error as Error);
      throw new AuthenticationError('Erro ao verificar senha', 'VERIFY_ERROR');
    }
  },
};
