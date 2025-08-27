/**
 * Employee type definitions for the Ledger UI
 */

export interface Employee {
  id: string;
  name: string;
  title: string;
  position?: string; // Added as an alias for title for backward compatibility
  email: string;
  department: string;
  hireDate: string;
  costRate: number; // Cost per hour or day
  capacity: number; // Hours per week or percentage
  status: EmployeeStatus;
  imageUrl?: string; // URL to employee's avatar image
  // New fields
  managerId?: string; // Reference to the manager (another employee)
  state?: string; // Employee's state location
  country?: string; // Employee's country location
  jobProfile?: string; // Employee's job profile
  employeeType: EmployeeType; // Type of employment
}

export type EmployeeStatus = 'active' | 'inactive' | 'leave' | 'contract';

export type EmployeeType = 'employee' | 'contractor';

export interface EmployeeFilters {
  department?: string;
  status?: EmployeeStatus;
  employeeType?: EmployeeType;
}

export type NewEmployee = Omit<Employee, 'id'>;

// Predefined job profiles
export const JOB_PROFILES = [
  'Software Engineer',
  'Senior Software Engineer',
  'Principal Engineer',
  'Engineering Manager',
  'Product Manager',
  'UX Designer',
  'UI Designer',
  'Data Scientist',
  'Data Engineer',
  'DevOps Engineer',
  'QA Engineer',
  'Technical Writer',
  'Project Manager'
];