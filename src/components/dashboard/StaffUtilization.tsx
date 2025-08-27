import React, { useMemo } from 'react';
import { Allocation } from '../../types/allocation';
import { Employee } from '../../types/employee';
import { calculateTotalAllocation, isOverallocated } from '../../utils/percentage-utils';
import Card from '../common/Card';

interface StaffUtilizationProps {
  allocations: Allocation[];
  employees: Employee[];
  month: string;
}

const StaffUtilization: React.FC<StaffUtilizationProps> = ({
  allocations,
  employees,
  month,
}) => {
  // Calculate utilization metrics
  const metrics = useMemo(() => {
    // Filter allocations for the current month
    const currentMonthAllocations = allocations.filter((a) => a.month === month);
    
    // Get unique employees with allocations
    const employeesWithAllocations = new Set(
      currentMonthAllocations.map((a) => a.employeeId)
    );
    
    // Calculate employee utilization data
    const employeeData = employees.map((employee) => {
      const employeeAllocations = currentMonthAllocations.filter(
        (a) => a.employeeId === employee.id
      );
      
      const totalPercentage = calculateTotalAllocation(employeeAllocations);
      const isAllocated = employeeAllocations.length > 0;
      const isOver = isOverallocated(totalPercentage);
      
      return {
        employee,
        totalPercentage,
        isAllocated,
        isOver,
      };
    });
    
    // Calculate summary metrics
    const totalEmployees = employees.length;
    const allocatedCount = employeeData.filter((d) => d.isAllocated).length;
    const overallocatedCount = employeeData.filter((d) => d.isOver).length;
    const unallocatedCount = totalEmployees - allocatedCount;
    
    // Calculate average utilization (for allocated employees)
    const allocatedEmployees = employeeData.filter((d) => d.isAllocated);
    const averageUtilization = allocatedEmployees.length
      ? allocatedEmployees.reduce((sum, d) => sum + d.totalPercentage, 0) / allocatedEmployees.length
      : 0;
    
    // Calculate utilization rate (% of employees with allocations)
    const utilizationRate = totalEmployees ? (allocatedCount / totalEmployees) * 100 : 0;
    
    return {
      totalEmployees,
      allocatedCount,
      unallocatedCount,
      overallocatedCount,
      averageUtilization,
      utilizationRate,
    };
  }, [allocations, employees, month]);

  // Render utilization metrics cards
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Total Staff</h3>
            <p className="text-2xl font-semibold text-gray-900">{metrics.totalEmployees}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Allocated</h3>
            <p className="text-2xl font-semibold text-gray-900">{metrics.allocatedCount} <span className="text-sm text-gray-500">({Math.round(metrics.utilizationRate)}%)</span></p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-amber-100 p-3">
            <svg className="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Over-allocated</h3>
            <p className="text-2xl font-semibold text-gray-900">{metrics.overallocatedCount}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-red-100 p-3">
            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Unallocated</h3>
            <p className="text-2xl font-semibold text-gray-900">{metrics.unallocatedCount}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-purple-100 p-3">
            <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Average Utilization</h3>
            <p className="text-2xl font-semibold text-gray-900">{Math.round(metrics.averageUtilization)}%</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Utilization Rate</h3>
            <p className="text-2xl font-semibold text-gray-900">{Math.round(metrics.utilizationRate)}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StaffUtilization;