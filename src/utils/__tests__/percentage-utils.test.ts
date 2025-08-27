import {
  decimalToPercentage,
  percentageToDecimal,
  formatPercentage,
  normalizePercentage,
  calculateTotalAllocation,
  calculateRemainingPercentage,
  distributePercentageEvenly,
  isOverallocated,
  getAllocationColor,
  calculateUtilizationRate,
  calculateAverageAllocation,
  getUtilizationStatus
} from '../percentage-utils';
import { Allocation } from '../../types/allocation';

describe('Percentage Utilities', () => {
  describe('decimalToPercentage', () => {
    test('converts decimals to percentages correctly', () => {
      expect(decimalToPercentage(0.75)).toBe(75);
      expect(decimalToPercentage(0.25)).toBe(25);
      expect(decimalToPercentage(1)).toBe(100);
      expect(decimalToPercentage(0)).toBe(0);
    });

    test('handles rounding', () => {
      expect(decimalToPercentage(0.333)).toBe(33);
      expect(decimalToPercentage(0.666)).toBe(67);
      expect(decimalToPercentage(0.999)).toBe(100);
    });

    test('handles negative values', () => {
      expect(decimalToPercentage(-0.5)).toBe(-50);
    });
  });

  describe('percentageToDecimal', () => {
    test('converts percentages to decimals correctly', () => {
      expect(percentageToDecimal(75)).toBe(0.75);
      expect(percentageToDecimal(25)).toBe(0.25);
      expect(percentageToDecimal(100)).toBe(1);
      expect(percentageToDecimal(0)).toBe(0);
    });

    test('handles negative values', () => {
      expect(percentageToDecimal(-50)).toBe(-0.5);
    });
  });

  describe('formatPercentage', () => {
    test('formats numbers as percentage strings', () => {
      expect(formatPercentage(75)).toBe('75%');
      expect(formatPercentage(25.5)).toBe('26%');
      expect(formatPercentage(0)).toBe('0%');
    });

    test('rounds percentages', () => {
      expect(formatPercentage(33.3)).toBe('33%');
      expect(formatPercentage(66.6)).toBe('67%');
    });

    test('handles undefined and null', () => {
      expect(formatPercentage(undefined as any)).toBe('0%');
      expect(formatPercentage(null as any)).toBe('0%');
    });
  });

  describe('normalizePercentage', () => {
    test('ensures values are between 0 and 100', () => {
      expect(normalizePercentage(50)).toBe(50);
      expect(normalizePercentage(0)).toBe(0);
      expect(normalizePercentage(100)).toBe(100);
    });

    test('clamps values below 0 to 0', () => {
      expect(normalizePercentage(-10)).toBe(0);
      expect(normalizePercentage(-100)).toBe(0);
    });

    test('clamps values above 100 to 100', () => {
      expect(normalizePercentage(110)).toBe(100);
      expect(normalizePercentage(150)).toBe(100);
    });

    test('handles undefined and null', () => {
      expect(normalizePercentage(undefined as any)).toBe(0);
      expect(normalizePercentage(null as any)).toBe(0);
    });
  });

  describe('calculateTotalAllocation', () => {
    test('sums up allocation percentages correctly', () => {
      const allocations: Allocation[] = [
        { id: '1', employeeId: 'emp1', projectId: 'proj1', month: '2025-05', percentage: 25, notes: '' } as Allocation,
        { id: '2', employeeId: 'emp1', projectId: 'proj2', month: '2025-05', percentage: 50, notes: '' } as Allocation,
        { id: '3', employeeId: 'emp1', projectId: 'proj3', month: '2025-05', percentage: 25, notes: '' } as Allocation
      ];
      expect(calculateTotalAllocation(allocations)).toBe(100);
    });

    test('handles empty array', () => {
      expect(calculateTotalAllocation([])).toBe(0);
    });

    test('handles zero percentages', () => {
      const allocations: Allocation[] = [
        { id: '1', employeeId: 'emp1', projectId: 'proj1', month: '2025-05', percentage: 0, notes: '' } as Allocation,
        { id: '2', employeeId: 'emp1', projectId: 'proj2', month: '2025-05', percentage: 0, notes: '' } as Allocation
      ];
      expect(calculateTotalAllocation(allocations)).toBe(0);
    });
  });

  describe('calculateRemainingPercentage', () => {
    test('calculates remaining percentage correctly', () => {
      expect(calculateRemainingPercentage(75)).toBe(25);
      expect(calculateRemainingPercentage(50)).toBe(50);
      expect(calculateRemainingPercentage(0)).toBe(100);
      expect(calculateRemainingPercentage(100)).toBe(0);
    });

    test('returns 0 when allocation exceeds 100%', () => {
      expect(calculateRemainingPercentage(110)).toBe(0);
      expect(calculateRemainingPercentage(150)).toBe(0);
    });

    test('handles negative allocation (though it should not occur)', () => {
      expect(calculateRemainingPercentage(-10)).toBe(110);
    });
  });

  describe('distributePercentageEvenly', () => {
    test('distributes percentages evenly', () => {
      expect(distributePercentageEvenly(100, 4)).toEqual([25, 25, 25, 25]);
      expect(distributePercentageEvenly(50, 2)).toEqual([25, 25]);
      expect(distributePercentageEvenly(100, 3)).toEqual([34, 33, 33]); // 33.33... percent each, but with rounding
    });

    test('handles remainder distribution', () => {
      expect(distributePercentageEvenly(100, 3)).toEqual([34, 33, 33]); // 33.33... percent each, first gets the extra
      expect(distributePercentageEvenly(10, 3)).toEqual([4, 3, 3]);
    });

    test('handles zero count', () => {
      expect(distributePercentageEvenly(100, 0)).toEqual([]);
    });

    test('handles zero total', () => {
      expect(distributePercentageEvenly(0, 5)).toEqual([0, 0, 0, 0, 0]);
    });
  });

  describe('isOverallocated', () => {
    test('identifies overallocation correctly', () => {
      expect(isOverallocated(101)).toBe(true);
      expect(isOverallocated(150)).toBe(true);
    });

    test('identifies valid allocations', () => {
      expect(isOverallocated(100)).toBe(false);
      expect(isOverallocated(75)).toBe(false);
      expect(isOverallocated(0)).toBe(false);
    });
  });

  describe('getAllocationColor', () => {
    test('returns correct CSS class based on allocation percentage', () => {
      expect(getAllocationColor(101)).toBe('text-red-600');    // > 100%
      expect(getAllocationColor(95)).toBe('text-orange-600');  // > 90%
      expect(getAllocationColor(75)).toBe('text-amber-600');   // > 50%
      expect(getAllocationColor(50)).toBe('text-green-600');   // <= 50%
      expect(getAllocationColor(25)).toBe('text-green-600');   
      expect(getAllocationColor(0)).toBe('text-green-600');
    });

    test('handles edge cases', () => {
      expect(getAllocationColor(90)).toBe('text-amber-600');   // exactly 90% should be amber
      expect(getAllocationColor(50)).toBe('text-green-600');   // exactly 50% should be green
      expect(getAllocationColor(100)).toBe('text-orange-600'); // exactly 100% should be orange
    });
  });

  describe('calculateUtilizationRate', () => {
    test('calculates utilization rate correctly', () => {
      expect(calculateUtilizationRate(100, 75)).toBe(75);
      expect(calculateUtilizationRate(100, 0)).toBe(0);
      expect(calculateUtilizationRate(100, 100)).toBe(100);
    });

    test('handles zero employees count', () => {
      expect(calculateUtilizationRate(0, 0)).toBe(0);
    });

    test('handles more allocated than total (should not occur but testing edge case)', () => {
      expect(calculateUtilizationRate(10, 15)).toBe(150);
    });
  });

  describe('calculateAverageAllocation', () => {
    test('calculates average allocation correctly', () => {
      expect(calculateAverageAllocation(100, 4)).toBe(25);
      expect(calculateAverageAllocation(75, 3)).toBe(25);
      expect(calculateAverageAllocation(0, 5)).toBe(0);
    });

    test('handles zero employees count', () => {
      expect(calculateAverageAllocation(100, 0)).toBe(0);
    });
  });

  describe('getUtilizationStatus', () => {
    test('returns correct utilization status', () => {
      expect(getUtilizationStatus(0)).toBe('Unallocated');
      expect(getUtilizationStatus(25)).toBe('Under-utilized');
      expect(getUtilizationStatus(49)).toBe('Under-utilized');
      expect(getUtilizationStatus(50)).toBe('Allocated');
      expect(getUtilizationStatus(75)).toBe('Allocated');
      expect(getUtilizationStatus(100)).toBe('Allocated');
      expect(getUtilizationStatus(101)).toBe('Over-allocated');
      expect(getUtilizationStatus(150)).toBe('Over-allocated');
    });
  });
});