import React, { useMemo } from 'react';
import { Allocation } from '../../types/allocation';
import { Employee } from '../../types/employee';
import { Project } from '../../types/project';
import { formatPercentage, calculateTotalAllocation, getAllocationColor } from '../../utils/percentage-utils';
import Card from '../common/Card';

interface AllocationChartProps {
  allocations: Allocation[];
  employees: Employee[];
  projects: Project[];
  month: string;
}

const AllocationChart: React.FC<AllocationChartProps> = ({
  allocations,
  employees,
  projects,
  month,
}) => {
  // Generate chart data by employee
  const employeeAllocationData = useMemo(() => {
    return employees.map((employee) => {
      const employeeAllocations = allocations.filter(
        (a) => a.employeeId === employee.id && a.month === month
      );

      // Group allocations by project
      const projectAllocations = projects.map((project) => {
        const allocation = employeeAllocations.find((a) => a.projectId === project.id);
        return {
          project,
          percentage: allocation ? allocation.percentage : 0,
        };
      }).filter((item) => item.percentage > 0);

      const totalPercentage = calculateTotalAllocation(employeeAllocations);

      return {
        employee,
        allocations: projectAllocations,
        totalPercentage,
      };
    }).filter((item) => item.allocations.length > 0);
  }, [allocations, employees, projects, month]);

  // Order employees by total allocation (descending)
  const sortedData = [...employeeAllocationData].sort(
    (a, b) => b.totalPercentage - a.totalPercentage
  );

  return (
    <Card title="Resource Utilization">
      <div className="space-y-6">
        {sortedData.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            No allocations found for the selected month.
          </div>
        ) : (
          sortedData.map(({ employee, allocations, totalPercentage }) => (
            <div key={employee.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    {employee.imageUrl ? (
                      <img
                        src={employee.imageUrl}
                        alt={employee.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-blue-600">
                        {employee.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-xs text-gray-500">{employee.position}</div>
                  </div>
                </div>
                <div className={`font-medium ${getAllocationColor(totalPercentage)}`}>
                  {formatPercentage(totalPercentage)}
                </div>
              </div>

              <div className="h-6 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="flex h-full">
                  {allocations.map(({ project, percentage }) => {
                    // Calculate width based on percentage of total (capped at 100%)
                    const width = `${Math.min(percentage, 100)}%`;
                    
                    // Status-based color for the project bar
                    const getColorClass = () => {
                      switch (project.status) {
                        case 'active': return 'bg-green-500';
                        case 'planned': return 'bg-blue-500';
                        case 'completed': return 'bg-purple-500';
                        case 'on-hold': return 'bg-amber-500';
                        default: return 'bg-gray-500';
                      }
                    };

                    return (
                      <div
                        key={project.id}
                        className={`${getColorClass()} h-full`}
                        style={{ width }}
                        title={`${project.name}: ${formatPercentage(percentage)}`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                {allocations.map(({ project, percentage }) => (
                  <div key={project.id} className="flex items-center">
                    <div
                      className="mr-1 h-3 w-3 rounded-full"
                      style={{
                        backgroundColor:
                          project.status === 'active'
                            ? '#10B981' // green-500
                            : project.status === 'planned'
                            ? '#3B82F6' // blue-500
                            : project.status === 'completed'
                            ? '#8B5CF6' // purple-500
                            : '#F59E0B', // amber-500
                      }}
                    />
                    <span>
                      {project.name} ({formatPercentage(percentage)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default AllocationChart;