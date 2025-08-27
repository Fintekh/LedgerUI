/**
 * Percentage utility functions for allocation management
 */

import { Allocation } from '../types/allocation';

/**
 * Convert a decimal value to a percentage (multiplies by 100 and rounds)
 */
export function decimalToPercentage(value: number): number {
  return Math.round(value * 100);
}

/**
 * Convert a percentage to a decimal value (divides by 100)
 */
export function percentageToDecimal(value: number): number {
  return value / 100;
}

/**
 * Format a number as a percentage string (adds % symbol and rounds)
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '0%';
  }
  return `${Math.round(value)}%`;
}

/**
 * Ensure a percentage value is between 0 and 100
 */
export function normalizePercentage(value: number | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }
  return Math.max(0, Math.min(100, value));
}

/**
 * Calculate the total allocation percentage from a list of allocations
 */
export function calculateTotalAllocation(allocations: Allocation[]): number {
  return allocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
}

/**
 * Calculate the remaining percentage available (100 - allocated)
 */
export function calculateRemainingPercentage(allocatedPercentage: number): number {
  return Math.max(0, 100 - allocatedPercentage);
}

/**
 * Distribute a total percentage evenly among a number of items
 */
export function distributePercentageEvenly(totalPercentage: number, count: number): number[] {
  if (count === 0) return [];
  
  const baseValue = Math.floor(totalPercentage / count);
  const remainder = totalPercentage % count;
  
  return Array(count).fill(baseValue).map((value, index) => 
    index < remainder ? value + 1 : value
  );
}

/**
 * Check if an allocation percentage exceeds 100%
 */
export function isOverallocated(percentage: number): boolean {
  return percentage > 100;
}

/**
 * Get a CSS color class based on allocation percentage
 */
export function getAllocationColor(percentage: number): string {
  if (percentage > 100) return 'text-red-600';
  if (percentage > 90) return 'text-orange-600';
  if (percentage > 50) return 'text-amber-600';
  return 'text-green-600';
}

/**
 * Calculate utilization rate as a percentage of allocated employees
 */
export function calculateUtilizationRate(totalEmployees: number, allocatedEmployees: number): number {
  if (totalEmployees === 0) return 0;
  return (allocatedEmployees / totalEmployees) * 100;
}

/**
 * Calculate average allocation percentage per employee
 */
export function calculateAverageAllocation(totalAllocation: number, employeeCount: number): number {
  if (employeeCount === 0) return 0;
  return totalAllocation / employeeCount;
}

/**
 * Get a descriptive status based on allocation percentage
 */
export function getUtilizationStatus(percentage: number): string {
  if (percentage <= 0) return 'Unallocated';
  if (percentage < 50) return 'Under-utilized';
  if (percentage <= 100) return 'Allocated';
  return 'Over-allocated';
}
