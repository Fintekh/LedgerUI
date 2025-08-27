import { formatDateRange } from '../date-utils';

describe('formatDateRange', () => {
  test('formats date range correctly', () => {
    // The date constructor uses the local timezone, so we need to be explicit
    const startDate = new Date('2025-05-05T12:00:00Z');
    const endDate = new Date('2025-05-11T12:00:00Z');
    
    const result = formatDateRange(startDate, endDate);
    console.log('Test 1 - Expected: "May 5 - 11, 2025", Actual:', result);
    expect(result).toBe('May 5 - 11, 2025');
  });

  test('handles different months', () => {
    const startDate = new Date('2025-05-26T12:00:00Z');
    const endDate = new Date('2025-06-01T12:00:00Z');
    
    const result = formatDateRange(startDate, endDate);
    console.log('Test 2 - Expected: "May 26 - Jun 1, 2025", Actual:', result);
    expect(result).toBe('May 26 - Jun 1, 2025');
  });

  test('handles different years', () => {
    const startDate = new Date('2025-12-29T12:00:00Z');
    const endDate = new Date('2026-01-04T12:00:00Z');
    
    const result = formatDateRange(startDate, endDate);
    console.log('Test 3 - Expected: "Dec 29, 2025 - Jan 4, 2026", Actual:', result);
    expect(result).toBe('Dec 29, 2025 - Jan 4, 2026');
  });
});
