import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should format message as JSON', () => {
    const result = logger.formatMessage('log', 'Test message');

    expect(JSON.parse(result)).toEqual({
      level: 'log',
      message: 'Test message',
      optionalParams: [],
    });
  });

  it('should format optional parameters', () => {
    const result = logger.formatMessage('warn', 'Warning', 'AppService');

    expect(JSON.parse(result)).toEqual({
      level: 'warn',
      message: 'Warning',
      optionalParams: ['AppService'],
    });
  });

  it('should call console.log with formatted message', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.log('Test message');

    expect(consoleSpy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'log',
        message: 'Test message',
        optionalParams: [],
      }),
    );
  });

  it('should call console.error for errors', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    logger.error('Something went wrong');

    expect(consoleSpy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'error',
        message: 'Something went wrong',
        optionalParams: [],
      }),
    );
  });
});
