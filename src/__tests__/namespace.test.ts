import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Develog } from '../logger';

describe('Develog - Namespace', () => {
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>;
    info: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
    };

    vi.stubGlobal('window', {
      location: { hostname: 'localhost' },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('namespace() 메서드', () => {
    it('네임스페이스 로거를 생성해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      const apiLogger = logger.namespace('API');

      expect(apiLogger).toBeInstanceOf(Develog);
    });

    it('같은 네임스페이스를 요청하면 같은 인스턴스를 반환해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      const apiLogger1 = logger.namespace('API');
      const apiLogger2 = logger.namespace('API');

      expect(apiLogger1).toBe(apiLogger2);
    });

    it('네임스페이스 prefix가 추가되어야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      const apiLogger = logger.namespace('API');

      apiLogger.log('test');

      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]:API', 'test');
    });

    it('여러 네임스페이스를 생성할 수 있어야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      const apiLogger = logger.namespace('API');
      const dbLogger = logger.namespace('DB');

      apiLogger.log('api test');
      dbLogger.log('db test');

      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]:API', 'api test');
      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]:DB', 'db test');
    });

    it('계층 구조를 지원해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      const apiLogger = logger.namespace('API');
      const userApiLogger = apiLogger.namespace('User');

      userApiLogger.log('nested');

      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]:API:User', 'nested');
    });
  });

  describe('enabledNamespaces 필터링', () => {
    it('필터가 없으면 모든 네임스페이스를 활성화해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      const apiLogger = logger.namespace('API');
      const dbLogger = logger.namespace('DB');

      apiLogger.log('api');
      dbLogger.log('db');

      expect(consoleSpy.log).toHaveBeenCalledTimes(2);
    });

    it('지정된 네임스페이스만 활성화해야 함', () => {
      const logger = new Develog({
        forceEnvironment: 'local',
        enabledNamespaces: ['API'],
      });

      const apiLogger = logger.namespace('API');
      const dbLogger = logger.namespace('DB');

      apiLogger.log('api');
      dbLogger.log('db');

      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]:API', 'api');
    });

    it('여러 네임스페이스를 활성화할 수 있어야 함', () => {
      const logger = new Develog({
        forceEnvironment: 'local',
        enabledNamespaces: ['API', 'DB'],
      });

      const apiLogger = logger.namespace('API');
      const dbLogger = logger.namespace('DB');
      const cacheLogger = logger.namespace('Cache');

      apiLogger.log('api');
      dbLogger.log('db');
      cacheLogger.log('cache');

      expect(consoleSpy.log).toHaveBeenCalledTimes(2);
    });

    it('*는 모든 네임스페이스를 활성화해야 함', () => {
      const logger = new Develog({
        forceEnvironment: 'local',
        enabledNamespaces: ['*'],
      });

      const apiLogger = logger.namespace('API');
      const dbLogger = logger.namespace('DB');

      apiLogger.log('api');
      dbLogger.log('db');

      expect(consoleSpy.log).toHaveBeenCalledTimes(2);
    });

    it('와일드카드 패턴을 지원해야 함', () => {
      const logger = new Develog({
        forceEnvironment: 'local',
        enabledNamespaces: ['API:*'],
      });

      const apiLogger = logger.namespace('API');
      const apiUserLogger = apiLogger.namespace('User');
      const apiProductLogger = apiLogger.namespace('Product');
      const dbLogger = logger.namespace('DB');

      apiLogger.log('api');
      apiUserLogger.log('user');
      apiProductLogger.log('product');
      dbLogger.log('db');

      expect(consoleSpy.log).toHaveBeenCalledTimes(3);
      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]:API', 'api');
      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]:API:User', 'user');
      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]:API:Product', 'product');
    });

    it('루트 로거는 필터와 관계없이 항상 활성화되어야 함', () => {
      const logger = new Develog({
        forceEnvironment: 'local',
        enabledNamespaces: ['API'],
      });

      logger.log('root');

      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]', 'root');
    });
  });

  describe('타임스탬프와 네임스페이스 통합', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-12-27T10:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('네임스페이스와 타임스탬프를 함께 표시해야 함', () => {
      const logger = new Develog({
        forceEnvironment: 'local',
        showTimestamp: true,
        timestampFormat: 'time',
      });

      const apiLogger = logger.namespace('API');
      apiLogger.log('test');

      const calls = consoleSpy.log.mock.calls as unknown[][];
      const prefix = calls[0]?.[0] as string;
      expect(prefix).toMatch(/^\[develog\]:API \[\d{2}:\d{2}:\d{2}\]$/);
    });
  });

  describe('info 메서드 테스트', () => {
    it('네임스페이스에서 info가 동작해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      const apiLogger = logger.namespace('API');

      apiLogger.info('information');

      expect(consoleSpy.info).toHaveBeenCalledWith('[develog]:API', 'information');
    });
  });
});
