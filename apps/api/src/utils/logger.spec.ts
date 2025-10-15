import { logger } from '@utils/logger';

describe('logger utility', () => {
  it('should have standard log methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });

  it('should log messages without throwing', () => {
    expect(() => logger.info('info log')).not.toThrow();
    expect(() => logger.error('error log')).not.toThrow();
  });

  it('should silence transports in test environment', () => {
    process.env['NODE_ENV'] = 'test';

    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { logger: testLogger } = require('@utils/logger');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    testLogger.transports.forEach((t: any) => {
      expect(t.silent).toBe(true);
    });
  });
});
