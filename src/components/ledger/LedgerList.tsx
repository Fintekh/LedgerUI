import React, { useState } from 'react';
import { useLedgers } from '../../services/api/ledger';
import { V2Ledger } from '../../types/ledger';
import Button from '../common/Button';
import Card from '../common/Card';
import DataTable from '../common/DataTable';
import { format } from 'date-fns';
import { ledgerApi } from '../../services/api/ledger';

interface LedgerListProps {
  onLedgerSelect?: (ledger: V2Ledger) => void;
  onCreateLedger?: () => void;
}

const LedgerList: React.FC<LedgerListProps> = ({ onLedgerSelect, onCreateLedger }) => {
  const [pageSize, setPageSize] = useState(15);
  const { data, isLoading, error, refetch } = useLedgers({ pageSize });

  const columns = [
    {
      header: 'Name',
      accessor: (ledger: V2Ledger) => (
        <span className="font-medium text-gray-900">{ledger.name}</span>
      ),
    },
    {
      header: 'Bucket',
      accessor: (ledger: V2Ledger) => (
        <span className="text-gray-600">{ledger.bucket}</span>
      ),
    },
    {
      header: 'Created',
      accessor: (ledger: V2Ledger) => (
        <span className="text-gray-600">
          {format(new Date(ledger.addedAt), 'MMM dd, yyyy HH:mm')}
        </span>
      ),
    },
    {
      header: 'Metadata',
      accessor: (ledger: V2Ledger) => (
        <div className="text-sm text-gray-500">
          {ledger.metadata ? Object.keys(ledger.metadata).length : 0} keys
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: (ledger: V2Ledger) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onLedgerSelect?.(ledger)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card title="Ledgers">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-sm">Loading ledgers...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load ledgers';
    
    return (
      <Card title="Ledgers">
        <div className="text-center py-8">
          <div className="mb-4">
            <div className="text-red-600 font-medium mb-2">Failed to load ledgers</div>
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
            {errorMessage.includes('Unable to connect to the server') && (
              <Button 
                onClick={() => window.open('http://localhost:3068/_/info', '_blank')} 
                variant="secondary"
              >
                Check Server Status
              </Button>
            )}
            <Button 
              onClick={async () => {
                try {
                  const isHealthy = await ledgerApi.healthCheck();
                  alert(isHealthy ? 'Server is healthy!' : 'Server is not responding');
                } catch (error) {
                  alert('Health check failed: ' + error);
                }
              }} 
              variant="secondary"
            >
              Test Connection
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const ledgers = data?.cursor.data || [];

  return (
    <Card title="Ledgers">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            {ledgers.length} ledger{ledgers.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {onCreateLedger && (
          <Button onClick={onCreateLedger} variant="primary">
            Create Ledger
          </Button>
        )}
      </div>

      {ledgers.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <p className="text-gray-500 font-medium mb-2">No ledgers found</p>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Get started by creating your first ledger to manage financial transactions and accounts.
            </p>
          </div>
          {onCreateLedger && (
            <Button onClick={onCreateLedger} variant="primary">
              Create Your First Ledger
            </Button>
          )}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={ledgers}
          keyExtractor={(ledger: V2Ledger) => ledger.name}
          onRowClick={onLedgerSelect}
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

export default LedgerList; 