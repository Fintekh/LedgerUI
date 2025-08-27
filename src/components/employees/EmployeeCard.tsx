import React from 'react';
import { Employee } from '../../types/employee';
import Card from '../common/Card';

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            {employee.imageUrl ? (
              <img
                src={employee.imageUrl}
                alt={employee.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-medium text-blue-600">
                {employee.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium">{employee.name}</h3>
            <div className="flex items-center">
              <p className="text-sm text-gray-500">{employee.position}</p>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                employee.employeeType === 'contractor' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {employee.employeeType === 'contractor' ? 'Contractor' : 'Employee'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-grow space-y-3">
          {employee.jobProfile && (
            <div>
              <span className="text-xs text-gray-500">Job Profile</span>
              <p className="text-sm">{employee.jobProfile}</p>
            </div>
          )}

          <div>
            <span className="text-xs text-gray-500">Department</span>
            <p className="text-sm">{employee.department}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Email</span>
            <p className="text-sm">{employee.email}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500">Hire Date</span>
            <p className="text-sm">{new Date(employee.hireDate).toLocaleDateString()}</p>
          </div>
          
          {(employee.state || employee.country) && (
            <div>
              <span className="text-xs text-gray-500">Location</span>
              <p className="text-sm">
                {[employee.state, employee.country].filter(Boolean).join(', ')}
              </p>
            </div>
          )}
          
          {employee.managerId && (
            <div>
              <span className="text-xs text-gray-500">Manager</span>
              <p className="text-sm">Reports to manager ID: {employee.managerId}</p>
            </div>
          )}
          
          {employee.employeeType === 'contractor' && employee.vendorId && (
            <div>
              <span className="text-xs text-gray-500">Vendor</span>
              <p className="text-sm">Vendor ID: {employee.vendorId}</p>
            </div>
          )}
          
          {employee.hourlyRate !== undefined && employee.hourlyRate > 0 && (
            <div>
              <span className="text-xs text-gray-500">Hourly Rate</span>
              <p className="text-sm">${employee.hourlyRate.toFixed(2)}/hr</p>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EmployeeCard;