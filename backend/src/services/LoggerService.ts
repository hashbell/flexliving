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

    // Add file transport in production
    if (process.env.NODE_ENV === 'production') {
      this.logger.add(new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error'
      }));
      this.logger.add(new winston.transports.File({
        filename: 'logs/combined.log'
      }));
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
