import React, { useState } from 'react';
import { useBalances } from '../../services/api/ledger';
import { V2Balance, PaginationParams } from '../../types/ledger';
import Button from '../common/Button';
import Card from '../common/Card';
import DataTable from '../common/DataTable';
import { format } from 'date-fns';

interface BalanceListProps {
  ledgerName: string;
  onBack?: () => void;
}

const BalanceList: React.FC<BalanceListProps> = ({ ledgerName, onBack }) => {
  const { data, isLoading, error, refetch } = useBalances(ledgerName);

  // Convert the API response to a format suitable for the DataTable
  const balances = data?.data ? Object.entries(data.data).map(([asset, balance]) => ({
    account: 'Aggregated', // Since this is aggregated balances
    asset,
    balance: balance.toString(),
    metadata: {}
  })) : [];

  const columns = [
    {
      header: 'Account',
      accessor: (balance: V2Balance) => (
        <span className="font-medium text-gray-900">{balance.account}</span>
      ),
    },
    {
      header: 'Asset',
      accessor: (balance: V2Balance) => (
        <span className="text-gray-600">{balance.asset}</span>
      ),
    },
    {
      header: 'Balance',
      accessor: (balance: V2Balance) => (
        <span className={`font-mono ${parseFloat(balance.balance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {parseFloat(balance.balance).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Metadata',
      accessor: (balance: V2Balance) => (
        <div className="text-sm text-gray-500">
          {balance.metadata ? Object.keys(balance.metadata).length : 0} keys
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card title={`Balances - ${ledgerName}`}>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-sm">Loading balances...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load balances';
    return (
      <Card title={`Balances - ${ledgerName}`}>
        <div className="text-center py-8">
          <div className="mb-4">
            <div className="text-red-600 font-medium mb-2">Failed to load balances</div>
            <div className="text-sm text-gray-600 max-w-md mx-auto">
              {errorMessage.includes('Unable to connect to the server') 
                ? 'The backend server is not responding. Please check if the Formance Ledger service is running.'
                : errorMessage
              }
            </div>
          </div>
          <div className="flex justify-center space-x-2">
            <Button onClick={() => refetch()} variant="secondary">
              Retry
            </Button>
            {onBack && (
              <Button onClick={onBack} variant="secondary">
                Back
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Debug logging
  console.log('BalanceList data:', data);
  console.log('BalanceList balances:', balances);

  return (
    <Card title={`Balances - ${ledgerName}`}>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            {balances.length} balance{balances.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {onBack && (
          <Button onClick={onBack} variant="secondary">
            Back
          </Button>
        )}
      </div>

      {balances.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <p className="text-gray-500 font-medium mb-2">No balances found</p>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              No account balances are available for this ledger.
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={balances}
          keyExtractor={(balance: V2Balance) => `${balance.account}-${balance.asset}`}
        />
      )}
    </Card>
  );
};

export default BalanceList; 