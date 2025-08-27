import React, { useState } from 'react';
import { useTransactions, useTransactionsCount } from '../../services/api/transaction';
import { V2Transaction } from '../../types/transaction';
import Button from '../common/Button';
import Card from '../common/Card';
import DataTable from '../common/DataTable';
import { format } from 'date-fns';

interface TransactionListProps {
  ledgerName: string;
  onTransactionSelect?: (transaction: V2Transaction) => void;
  onBackToLedgers?: () => void;
  onCreateTransaction?: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  ledgerName, 
  onTransactionSelect, 
  onBackToLedgers,
  onCreateTransaction 
}) => {
  const [pageSize, setPageSize] = useState(15);
  const { data, isLoading, error, refetch } = useTransactions(ledgerName, { pageSize });
  const { data: countData } = useTransactionsCount(ledgerName);

  const columns = [
    {
      header: 'ID',
      accessor: (transaction: V2Transaction) => (
        <span className="font-mono text-sm text-gray-900">{transaction.id}</span>
      ),
    },
    {
      header: 'Reference',
      accessor: (transaction: V2Transaction) => (
        <span className="text-gray-600">
          {transaction.reference || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Postings',
      accessor: (transaction: V2Transaction) => (
        <div className="text-sm text-gray-600">
          {transaction.postings.length} posting{transaction.postings.length !== 1 ? 's' : ''}
        </div>
      ),
    },
    {
      header: 'Created',
      accessor: (transaction: V2Transaction) => (
        <span className="text-gray-600">
          {transaction.insertedAt 
            ? format(new Date(transaction.insertedAt), 'MMM dd, yyyy HH:mm')
            : 'N/A'
          }
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (transaction: V2Transaction) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          transaction.reverted 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {transaction.reverted ? 'Reverted' : 'Active'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (transaction: V2Transaction) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onTransactionSelect?.(transaction)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card title={`Transactions in ${ledgerName}`}>
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
      : 'Failed to load transactions';
    
    return (
      <Card title={`Transactions in ${ledgerName}`}>
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

  const transactions = data?.cursor.data || [];

  return (
    <Card title={`Transactions in ${ledgerName}`}>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm text-gray-600">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found
              {countData !== undefined && ` (Total: ${countData})`}
            </p>
          </div>
          {onBackToLedgers && (
            <Button onClick={onBackToLedgers} variant="secondary" size="sm">
              Back to Ledgers
            </Button>
          )}
        </div>
        {onCreateTransaction && (
          <Button onClick={onCreateTransaction} variant="primary">
            Create Transaction
          </Button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500 mb-4">
            This ledger doesn't have any transactions yet. Create your first transaction to get started.
          </p>
          {onCreateTransaction && (
            <Button onClick={onCreateTransaction} variant="primary">
              Create First Transaction
            </Button>
          )}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={transactions}
          keyExtractor={(transaction: V2Transaction) => transaction.id.toString()}
          onRowClick={onTransactionSelect}
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

export default TransactionList; 