import { describe, it, expect, beforeEach, vi } from 'vitest';
import { detectEnvironment } from './environment';

describe('detectEnvironment', () => {
  beforeEach(() => {
    // Mock window.location을 초기화
    vi.stubGlobal('window', {
      location: { hostname: 'localhost' },
    });
  });

  describe('Local 환경 감지', () => {
    it('localhost를 local로 감지해야 함', () => {
      window.location.hostname = 'localhost';
      expect(detectEnvironment()).toBe('local');
    });

    it('127.0.0.1을 local로 감지해야 함', () => {
      window.location.hostname = '127.0.0.1';
      expect(detectEnvironment()).toBe('local');
    });

    it('0.0.0.0을 local로 감지해야 함', () => {
      window.location.hostname = '0.0.0.0';
      expect(detectEnvironment()).toBe('local');
    });

    it('::1 (IPv6)을 local로 감지해야 함', () => {
      window.location.hostname = '::1';
      expect(detectEnvironment()).toBe('local');
    });

    it('[::1] (IPv6 브라켓)을 local로 감지해야 함', () => {
      window.location.hostname = '[::1]';
      expect(detectEnvironment()).toBe('local');
    });
  });

  describe('Dev 환경 감지', () => {
    it('dev. 접두사를 dev로 감지해야 함', () => {
      window.location.hostname = 'dev.example.com';
      expect(detectEnvironment()).toBe('dev');
    });

    it('development. 접두사를 dev로 감지해야 함', () => {
      window.location.hostname = 'development.myapp.io';
      expect(detectEnvironment()).toBe('dev');
    });
  });

  describe('Stage 환경 감지', () => {
    it('stage. 접두사를 stage로 감지해야 함', () => {
      window.location.hostname = 'stage.example.com';
      expect(detectEnvironment()).toBe('stage');
    });

    it('staging. 접두사를 stage로 감지해야 함', () => {
      window.location.hostname = 'staging.myapp.io';
      expect(detectEnvironment()).toBe('stage');
    });
  });

  describe('Production 환경 감지', () => {
    it('www. 접두사를 production으로 감지해야 함', () => {
      window.location.hostname = 'www.example.com';
      expect(detectEnvironment()).toBe('production');
    });

    it('prod. 접두사를 production으로 감지해야 함', () => {
      window.location.hostname = 'prod.example.com';
      expect(detectEnvironment()).toBe('production');
    });

    it('production. 접두사를 production으로 감지해야 함', () => {
      window.location.hostname = 'production.example.com';
      expect(detectEnvironment()).toBe('production');
    });
  });

  describe('Unknown 환경 감지', () => {
    it('매칭되지 않는 hostname을 unknown으로 감지해야 함', () => {
      window.location.hostname = 'random.domain.com';
      expect(detectEnvironment()).toBe('unknown');
    });

    it('example.com을 unknown으로 감지해야 함', () => {
      window.location.hostname = 'example.com';
      expect(detectEnvironment()).toBe('unknown');
    });
  });

  describe('커스텀 패턴', () => {
    it('커스텀 dev 패턴을 적용해야 함', () => {
      window.location.hostname = 'test.example.com';
      const customPatterns = {
        dev: /^test\./,
      };
      expect(detectEnvironment(customPatterns)).toBe('dev');
    });

    it('커스텀 stage 패턴을 적용해야 함', () => {
      window.location.hostname = 'qa.example.com';
      const customPatterns = {
        stage: /^qa\./,
      };
      expect(detectEnvironment(customPatterns)).toBe('stage');
    });

    it('커스텀 production 패턴을 적용해야 함', () => {
      window.location.hostname = 'api.example.com';
      const customPatterns = {
        production: /^api\./,
      };
      expect(detectEnvironment(customPatterns)).toBe('production');
    });

    it('여러 커스텀 패턴을 동시에 적용해야 함', () => {
      const customPatterns = {
        dev: /^(dev|test)\./,
        stage: /^(stage|qa|uat)\./,
        production: /^(www|api|app)\./,
      };

      window.location.hostname = 'test.example.com';
      expect(detectEnvironment(customPatterns)).toBe('dev');

      window.location.hostname = 'qa.example.com';
      expect(detectEnvironment(customPatterns)).toBe('stage');

      window.location.hostname = 'app.example.com';
      expect(detectEnvironment(customPatterns)).toBe('production');
    });
  });

  describe('환경 우선순위', () => {
    it('local이 다른 환경보다 우선해야 함', () => {
      // localhost는 항상 local로 감지되어야 함
      window.location.hostname = 'localhost';
      const customPatterns = {
        dev: /localhost/,
      };
      expect(detectEnvironment(customPatterns)).toBe('local');
    });
  });

  describe('브라우저 환경 체크', () => {
    it('window가 없으면 unknown을 반환해야 함', () => {
      vi.stubGlobal('window', undefined);
      expect(detectEnvironment()).toBe('unknown');
    });

    it('window.location이 없으면 unknown을 반환해야 함', () => {
      vi.stubGlobal('window', {});
      expect(detectEnvironment()).toBe('unknown');
    });
  });
});
