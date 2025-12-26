import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { formatTimestamp } from './utils';

describe('formatTimestamp', () => {
  beforeEach(() => {
    // Mock Date to have consistent timestamp
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-12-26T15:30:45.123Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('기본 포맷(time)을 사용해야 함', () => {
    const result = formatTimestamp();
    // 시간은 로컬 시간대에 따라 다를 수 있으므로 형식만 체크
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it('time 포맷을 올바르게 반환해야 함', () => {
    const result = formatTimestamp('time');
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it('datetime 포맷을 올바르게 반환해야 함', () => {
    const result = formatTimestamp('datetime');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('iso 포맷을 올바르게 반환해야 함', () => {
    const result = formatTimestamp('iso');
    expect(result).toBe('2025-12-26T15:30:45.123Z');
  });

  it('ms 포맷을 올바르게 반환해야 함', () => {
    const result = formatTimestamp('ms');
    expect(result).toMatch(/^\d+$/);
    expect(Number(result)).toBeGreaterThan(0);
  });

  it('잘못된 포맷은 time으로 폴백해야 함', () => {
    const result = formatTimestamp('invalid' as never);
    expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });

  it('시간이 한 자리일 때 0을 패딩해야 함', () => {
    vi.setSystemTime(new Date('2025-01-05T03:05:07.000Z'));
    const result = formatTimestamp('datetime');
    expect(result).toMatch(/2025-01-05 \d{2}:\d{2}:\d{2}/);
  });
});
