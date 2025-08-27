import React from 'react';
import { Employee } from '../../types/employee';
import EmployeeCard from './EmployeeCard';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ 
  employees, 
  onEdit, 
  onDelete 
}) => {
  if (employees.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
        <p className="text-gray-500">No employees found. Add your first employee to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onEdit={() => onEdit(employee)}
          onDelete={() => onDelete(employee)}
        />
      ))}
    </div>
  );
};

export default EmployeeList;