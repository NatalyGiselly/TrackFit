import type { AppError } from './error-types';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: {
    name: string;
    message: string;
    code?: string;
    stack?: string;
    context?: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
}

class ErrorLogger {
  private isDevelopment = __DEV__;

  private formatLog(context: LogContext): string {
    return JSON.stringify(context, null, this.isDevelopment ? 2 : 0);
  }

  private log(level: LogLevel, message: string, error?: Error | AppError, metadata?: Record<string, unknown>): void {
    const logContext: LogContext = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    };

    if (error) {
      logContext.error = {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      };

      if ('code' in error) {
        logContext.error.code = error.code;
      }

      if ('context' in error) {
        logContext.error.context = error.context;
      }
    }

    if (this.isDevelopment) {
      const consoleFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
      consoleFn(this.formatLog(logContext));
    } else {
      // In production, this would send to Sentry, LogRocket, etc.
      // For now, just store in memory or send to analytics
      this.sendToMonitoring(logContext);
    }
  }

  private sendToMonitoring(_context: LogContext): void {
    // TODO: Integrate with Sentry or similar service
    // Example:
    // Sentry.captureException(context.error, {
    //   level: context.level,
    //   extra: context.metadata,
    // });
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, undefined, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, undefined, metadata);
  }

  warn(message: string, error?: Error | AppError, metadata?: Record<string, unknown>): void {
    this.log('warn', message, error, metadata);
  }

  error(message: string, error?: Error | AppError, metadata?: Record<string, unknown>): void {
    this.log('error', message, error, metadata);
  }
}

export const errorLogger = new ErrorLogger();
