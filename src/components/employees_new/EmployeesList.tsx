import React from 'react';
import Card from '../common/Card';

const EmployeesList: React.FC = () => {
  return (
    <Card>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Employees</h2>
        <p>This is a template employees component. Implement your employee management functionality here.</p>
      </div>
    </Card>
  );
};

export default EmployeesList;
