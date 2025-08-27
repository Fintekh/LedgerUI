import React from 'react';
import Card from '../common/Card';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your application dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <h2 className="text-lg font-semibold mb-4">Welcome</h2>
          <p>This is a template dashboard component. Customize it for your application.</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
