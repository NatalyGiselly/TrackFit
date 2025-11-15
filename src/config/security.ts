export const SECURITY_CONFIG = {
  auth: {
    maxLoginAttempts: 3,
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    sessionTimeoutMs: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  password: {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
    minEntropy: 40,
  },
  crypto: {
    hashIterations: 10000,
    saltLength: 16,
    hashLength: 64,
  },
} as const;
