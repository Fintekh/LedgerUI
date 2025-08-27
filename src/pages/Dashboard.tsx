import React from 'react';
import Layout from '../components/common/Layout';
import LedgerArchitecture from '../components/common/LedgerArchitecture';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Formance Ledger Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Manage your ledgers, accounts, and transactions
          </p>
        </div>

        <LedgerArchitecture />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🏦 Ledgers</h3>
            <p className="text-gray-600 mb-4">
              Create and manage different ledgers for your business needs.
            </p>
            <a
              href="/ledgers"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Manage Ledgers
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Accounts</h3>
            <p className="text-gray-600 mb-4">
              View and manage accounts within your ledgers.
            </p>
            <a
              href="/accounts"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              View Accounts
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">💸 Transactions</h3>
            <p className="text-gray-600 mb-4">
              Create and track money movements between accounts.
            </p>
            <a
              href="/transactions"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Manage Transactions
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Settings</h3>
            <p className="text-gray-600 mb-4">
              Generate sample data and configure your environment.
            </p>
            <a
              href="/settings"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
            >
              Open Settings
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;