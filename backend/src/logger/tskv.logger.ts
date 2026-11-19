import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: any, ...optionalParams: any[]): string {
    const fields = {
      level,
      message,
      optionalParams: JSON.stringify(optionalParams),
    };

    return Object.entries(fields)
      .map(([key, value]) => `${key}=${this.escapeValue(String(value))}`)
      .join('\t');
  }

  private escapeValue(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/=/g, '\\=');
  }

  log(message: any, ...optionalParams: any[]): void {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]): void {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]): void {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]): void {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]): void {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }

  fatal(message: any, ...optionalParams: any[]): void {
    console.error(this.formatMessage('fatal', message, ...optionalParams));
  }
}
