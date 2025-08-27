import React, { useState } from 'react';
import { useAccounts, useAccountsCount } from '../../services/api/account';
import { V2Account } from '../../types/account';
import Button from '../common/Button';
import Card from '../common/Card';
import DataTable from '../common/DataTable';
import { format } from 'date-fns';

interface AccountListProps {
  ledgerName: string;
  onAccountSelect?: (account: V2Account) => void;
  onBackToLedgers?: () => void;
}

const AccountList: React.FC<AccountListProps> = ({ 
  ledgerName, 
  onAccountSelect, 
  onBackToLedgers 
}) => {
  const [pageSize, setPageSize] = useState(15);
  const { data, isLoading, error, refetch } = useAccounts(ledgerName, { pageSize });
  const { data: countData } = useAccountsCount(ledgerName);

  const columns = [
    {
      header: 'Address',
      accessor: (account: V2Account) => (
        <span className="font-mono text-sm text-gray-900">{account.address}</span>
      ),
    },
    {
      header: 'Created',
      accessor: (account: V2Account) => (
        <span className="text-gray-600">
          {account.insertionDate 
            ? format(new Date(account.insertionDate), 'MMM dd, yyyy HH:mm')
            : 'N/A'
          }
        </span>
      ),
    },
    {
      header: 'Updated',
      accessor: (account: V2Account) => (
        <span className="text-gray-600">
          {account.updatedAt 
            ? format(new Date(account.updatedAt), 'MMM dd, yyyy HH:mm')
            : 'N/A'
          }
        </span>
      ),
    },
    {
      header: 'Metadata',
      accessor: (account: V2Account) => (
        <div className="text-sm text-gray-500">
          {account.metadata ? Object.keys(account.metadata).length : 0} keys
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (account: V2Account) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onAccountSelect?.(account)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card title={`Accounts in ${ledgerName}`}>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    const errorMessage = error?.response?.status === 404 
      ? `Ledger "${ledgerName}" not found`
      : error?.response?.status === 405
      ? `API method not allowed for ledger "${ledgerName}"`
      : 'Failed to load accounts';
    
    return (
      <Card title={`Accounts in ${ledgerName}`}>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{errorMessage}</p>
          <div className="space-y-2">
            <Button onClick={() => refetch()} variant="secondary">
              Retry
            </Button>
            {onBackToLedgers && (
              <Button onClick={onBackToLedgers} variant="secondary">
                Back to Ledgers
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  const accounts = data?.cursor.data || [];

  return (
    <Card title={`Accounts in ${ledgerName}`}>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm text-gray-600">
              {accounts.length} account{accounts.length !== 1 ? 's' : ''} found
              {countData !== undefined && ` (Total: ${countData})`}
            </p>
          </div>
          {onBackToLedgers && (
            <Button onClick={onBackToLedgers} variant="secondary" size="sm">
              Back to Ledgers
            </Button>
          )}
        </div>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
          <p className="text-gray-500 mb-4">
            This ledger doesn't have any accounts yet. Accounts are created automatically when transactions are posted to them.
          </p>
          <div className="text-sm text-gray-400 space-y-2">
            <p>To create accounts, you can:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Post transactions to account addresses</li>
              <li>Use the API to create accounts with metadata</li>
              <li>Import account data from external sources</li>
            </ul>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={accounts}
          keyExtractor={(account: V2Account) => account.address}
          onRowClick={onAccountSelect}
        />
      )}

      {data?.cursor.hasMore && (
        <div className="mt-4 text-center">
          <Button variant="secondary" onClick={() => refetch()}>
            Load More
          </Button>
        </div>
      )}
    </Card>
  );
};

export default AccountList; 