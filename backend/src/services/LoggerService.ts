import winston from 'winston';

export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      defaultMeta: { service: 'flex-living-reviews-api' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    });

    // Only add file transport in non-serverless environments
    // Vercel and other serverless platforms don't support file writing
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      try {
        const fs = require('fs');
        const path = require('path');
        
        // Ensure logs directory exists
        const logsDir = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(logsDir)) {
          fs.mkdirSync(logsDir, { recursive: true });
        }
        
        this.logger.add(new winston.transports.File({
          filename: path.join(logsDir, 'error.log'),
          level: 'error'
        }));
        this.logger.add(new winston.transports.File({
          filename: path.join(logsDir, 'combined.log')
        }));
      } catch (error) {
        // If we can't create logs directory, just log to console
        console.warn('Could not create logs directory, using console logging only:', error);
      }
    }
  }

  public info(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  public warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  public error(message: string, context?: string): void {
    this.logger.error(message, { context });
  }

  public debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }
}
