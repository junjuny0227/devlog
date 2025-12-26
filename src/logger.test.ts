import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Develog, develog } from './logger';

describe('Develog', () => {
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>;
    info: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
    debug: ReturnType<typeof vi.spyOn>;
    group: ReturnType<typeof vi.spyOn>;
    groupCollapsed: ReturnType<typeof vi.spyOn>;
    groupEnd: ReturnType<typeof vi.spyOn>;
    table: ReturnType<typeof vi.spyOn>;
    time: ReturnType<typeof vi.spyOn>;
    timeEnd: ReturnType<typeof vi.spyOn>;
    count: ReturnType<typeof vi.spyOn>;
    countReset: ReturnType<typeof vi.spyOn>;
    clear: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    // Console 메서드들을 spy
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      group: vi.spyOn(console, 'group').mockImplementation(() => {}),
      groupCollapsed: vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {}),
      groupEnd: vi.spyOn(console, 'groupEnd').mockImplementation(() => {}),
      table: vi.spyOn(console, 'table').mockImplementation(() => {}),
      time: vi.spyOn(console, 'time').mockImplementation(() => {}),
      timeEnd: vi.spyOn(console, 'timeEnd').mockImplementation(() => {}),
      count: vi.spyOn(console, 'count').mockImplementation(() => {}),
      countReset: vi.spyOn(console, 'countReset').mockImplementation(() => {}),
      clear: vi.spyOn(console, 'clear').mockImplementation(() => {}),
    };

    // window.location mock
    vi.stubGlobal('window', {
      location: { hostname: 'localhost' },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('생성자 및 환경 감지', () => {
    it('기본 옵션으로 인스턴스를 생성해야 함', () => {
      const logger = new Develog();
      expect(logger).toBeInstanceOf(Develog);
    });

    it('local 환경을 올바르게 감지해야 함', () => {
      window.location.hostname = 'localhost';
      const logger = new Develog();
      expect(logger.getEnvironment()).toBe('local');
    });

    it('dev 환경을 올바르게 감지해야 함', () => {
      window.location.hostname = 'dev.example.com';
      const logger = new Develog();
      expect(logger.getEnvironment()).toBe('dev');
    });

    it('production 환경을 올바르게 감지해야 함', () => {
      window.location.hostname = 'www.example.com';
      const logger = new Develog();
      expect(logger.getEnvironment()).toBe('production');
    });

    it('forceEnvironment 옵션이 환경 감지를 오버라이드해야 함', () => {
      window.location.hostname = 'www.example.com';
      const logger = new Develog({ forceEnvironment: 'dev' });
      expect(logger.getEnvironment()).toBe('dev');
    });
  });

  describe('로깅 활성화 여부', () => {
    it('local 환경에서 기본적으로 활성화되어야 함', () => {
      window.location.hostname = 'localhost';
      const logger = new Develog();
      expect(logger.isLoggingEnabled()).toBe(true);
    });

    it('dev 환경에서 기본적으로 활성화되어야 함', () => {
      window.location.hostname = 'dev.example.com';
      const logger = new Develog();
      expect(logger.isLoggingEnabled()).toBe(true);
    });

    it('stage 환경에서 기본적으로 활성화되어야 함', () => {
      window.location.hostname = 'staging.example.com';
      const logger = new Develog();
      expect(logger.isLoggingEnabled()).toBe(true);
    });

    it('production 환경에서 기본적으로 비활성화되어야 함', () => {
      window.location.hostname = 'www.example.com';
      const logger = new Develog();
      expect(logger.isLoggingEnabled()).toBe(false);
    });

    it('커스텀 enabledEnvironments를 적용해야 함', () => {
      window.location.hostname = 'www.example.com';
      const logger = new Develog({
        enabledEnvironments: ['production'],
      });
      expect(logger.isLoggingEnabled()).toBe(true);
    });
  });

  describe('기본 로깅 메서드', () => {
    it('활성화된 환경에서 log()를 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.log('test message');

      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]', 'test message');
    });

    it('활성화된 환경에서 info()를 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.info('info message');

      expect(consoleSpy.info).toHaveBeenCalledWith('[develog]', 'info message');
    });

    it('활성화된 환경에서 warn()을 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.warn('warning');

      expect(consoleSpy.warn).toHaveBeenCalledWith('[develog]', 'warning');
    });

    it('활성화된 환경에서 error()를 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.error('error message');

      expect(consoleSpy.error).toHaveBeenCalledWith('[develog]', 'error message');
    });

    it('활성화된 환경에서 debug()를 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.debug('debug info');

      expect(consoleSpy.debug).toHaveBeenCalledWith('[develog]', 'debug info');
    });

    it('여러 인자를 전달해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      const obj = { key: 'value' };
      logger.log('message', 123, obj);

      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]', 'message', 123, obj);
    });
  });

  describe('비활성화된 환경에서의 동작', () => {
    it('production에서 log()를 호출하지 않아야 함', () => {
      const logger = new Develog({ forceEnvironment: 'production' });
      logger.log('test');

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('production에서 info()를 호출하지 않아야 함', () => {
      const logger = new Develog({ forceEnvironment: 'production' });
      logger.info('test');

      expect(consoleSpy.info).not.toHaveBeenCalled();
    });

    it('production에서 warn()을 호출하지 않아야 함', () => {
      const logger = new Develog({ forceEnvironment: 'production' });
      logger.warn('test');

      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });

    it('production에서 error()를 호출하지 않아야 함', () => {
      const logger = new Develog({ forceEnvironment: 'production' });
      logger.error('test');

      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });

  describe('그룹 로깅', () => {
    it('활성화된 환경에서 group()을 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.group('Group Label');

      expect(consoleSpy.group).toHaveBeenCalledWith('[develog] Group Label');
    });

    it('라벨 없이 group()을 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.group();

      expect(consoleSpy.group).toHaveBeenCalledWith();
    });

    it('활성화된 환경에서 groupCollapsed()를 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.groupCollapsed('Collapsed Group');

      expect(consoleSpy.groupCollapsed).toHaveBeenCalledWith('[develog] Collapsed Group');
    });

    it('활성화된 환경에서 groupEnd()를 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.groupEnd();

      expect(consoleSpy.groupEnd).toHaveBeenCalled();
    });

    it('비활성화된 환경에서 group 메서드를 호출하지 않아야 함', () => {
      const logger = new Develog({ forceEnvironment: 'production' });
      logger.group('test');
      logger.groupCollapsed('test');
      logger.groupEnd();

      expect(consoleSpy.group).not.toHaveBeenCalled();
      expect(consoleSpy.groupCollapsed).not.toHaveBeenCalled();
      expect(consoleSpy.groupEnd).not.toHaveBeenCalled();
    });
  });

  describe('고급 기능', () => {
    it('활성화된 환경에서 table()을 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      const data = [{ name: 'John', age: 30 }];
      logger.table(data);

      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]');
      expect(consoleSpy.table).toHaveBeenCalledWith(data);
    });

    it('활성화된 환경에서 time/timeEnd를 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.time('timer');
      logger.timeEnd('timer');

      expect(consoleSpy.time).toHaveBeenCalledWith('[develog] timer');
      expect(consoleSpy.timeEnd).toHaveBeenCalledWith('[develog] timer');
    });

    it('활성화된 환경에서 count/countReset을 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.count('counter');
      logger.countReset('counter');

      expect(consoleSpy.count).toHaveBeenCalledWith('[develog] counter');
      expect(consoleSpy.countReset).toHaveBeenCalledWith('[develog] counter');
    });

    it('라벨 없이 count를 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.count();

      expect(consoleSpy.count).toHaveBeenCalledWith('[develog]');
    });

    it('활성화된 환경에서 clear()를 호출해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.clear();

      expect(consoleSpy.clear).toHaveBeenCalled();
    });

    it('비활성화된 환경에서 고급 기능을 호출하지 않아야 함', () => {
      const logger = new Develog({ forceEnvironment: 'production' });
      logger.table([]);
      logger.time('test');
      logger.timeEnd('test');
      logger.count();
      logger.clear();

      expect(consoleSpy.table).not.toHaveBeenCalled();
      expect(consoleSpy.time).not.toHaveBeenCalled();
      expect(consoleSpy.timeEnd).not.toHaveBeenCalled();
      expect(consoleSpy.count).not.toHaveBeenCalled();
      expect(consoleSpy.clear).not.toHaveBeenCalled();
    });
  });

  describe('커스텀 prefix', () => {
    it('커스텀 prefix를 적용해야 함', () => {
      const logger = new Develog({
        forceEnvironment: 'local',
        prefix: '[MyApp]',
      });
      logger.log('test');

      expect(consoleSpy.log).toHaveBeenCalledWith('[MyApp]', 'test');
    });

    it('커스텀 prefix를 그룹에 적용해야 함', () => {
      const logger = new Develog({
        forceEnvironment: 'local',
        prefix: '[MyApp]',
      });
      logger.group('Group');

      expect(consoleSpy.group).toHaveBeenCalledWith('[MyApp] Group');
    });
  });

  describe('기본 develog 인스턴스', () => {
    it('develog가 Develog의 인스턴스여야 함', () => {
      expect(develog).toBeInstanceOf(Develog);
    });

    it('develog가 메서드를 가져야 함', () => {
      expect(typeof develog.log).toBe('function');
      expect(typeof develog.info).toBe('function');
      expect(typeof develog.warn).toBe('function');
      expect(typeof develog.error).toBe('function');
      expect(typeof develog.debug).toBe('function');
    });
  });

  describe('커스텀 hostname 패턴', () => {
    it('커스텀 패턴으로 환경을 감지해야 함', () => {
      window.location.hostname = 'test.example.com';
      const logger = new Develog({
        customHostnamePatterns: {
          dev: /^test\./,
        },
      });

      expect(logger.getEnvironment()).toBe('dev');
      expect(logger.isLoggingEnabled()).toBe(true);
    });
  });

  describe('엣지 케이스', () => {
    it('undefined를 로깅해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.log(undefined);

      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]', undefined);
    });

    it('null을 로깅해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.log(null);

      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]', null);
    });

    it('빈 문자열을 로깅해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      logger.log('');

      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]', '');
    });

    it('복잡한 객체를 로깅해야 함', () => {
      const logger = new Develog({ forceEnvironment: 'local' });
      const complex = {
        nested: { deep: { value: 123 } },
        array: [1, 2, 3],
        func: () => {},
      };
      logger.log(complex);

      expect(consoleSpy.log).toHaveBeenCalledWith('[develog]', complex);
    });
  });
});
