import type { Environment } from './types';

/**
 * 기본 hostname 패턴 정의
 */
const DEFAULT_HOSTNAME_PATTERNS: Record<Environment, RegExp> = {
  local: /^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1|\[::1\])/,
  dev: /^(dev|development)\./,
  stage: /^(stage|staging)\./,
  production: /^(prod|production|www)\./,
  unknown: /.*/,
};

/**
 * 현재 브라우저의 hostname 또는 IP를 기반으로 실행 환경을 감지
 * @param customPatterns - 커스텀 hostname 패턴
 * @returns 감지된 환경
 */
export function detectEnvironment(
  customPatterns?: Partial<Record<Environment, RegExp>>,
): Environment {
  // 브라우저 환경이 아닌 경우
  if (typeof window === 'undefined' || !window.location) {
    return 'unknown';
  }

  const hostname = window.location.hostname;
  const patterns = { ...DEFAULT_HOSTNAME_PATTERNS, ...customPatterns };

  // local 환경 체크 (최우선)
  if (patterns.local.test(hostname)) {
    return 'local';
  }

  // dev 환경 체크
  if (patterns.dev.test(hostname)) {
    return 'dev';
  }

  // stage 환경 체크
  if (patterns.stage.test(hostname)) {
    return 'stage';
  }

  // production 환경 체크
  if (patterns.production.test(hostname)) {
    return 'production';
  }

  // 매칭되지 않으면 unknown
  return 'unknown';
}
