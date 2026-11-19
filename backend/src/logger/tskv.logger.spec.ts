import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should format message as TSKV', () => {
    const result = logger.formatMessage('log', 'Test message');

    expect(result).toBe('level=log\tmessage=Test message\toptionalParams=[]');
  });

  it('should format optional parameters', () => {
    const result = logger.formatMessage('warn', 'Warning', 'AppService');

    expect(result).toBe(
      'level=warn\tmessage=Warning\toptionalParams=["AppService"]',
    );
  });

  it('should escape special characters', () => {
    const result = logger.formatMessage('error', 'Line 1\nLine 2\tError');

    expect(result).toContain('message=Line 1\\nLine 2\\tError');
  });

  it('should call console.warn with TSKV message', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    logger.warn('Warning');

    expect(consoleSpy).toHaveBeenCalledWith(
      'level=warn\tmessage=Warning\toptionalParams=[]',
    );
  });
});
