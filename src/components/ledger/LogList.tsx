import React, { useState } from 'react';
import { useLogs } from '../../services/api/ledger';
import { V2Log, PaginationParams } from '../../types/ledger';
import Button from '../common/Button';
import Card from '../common/Card';
import DataTable from '../common/DataTable';
import Popover from '../common/Popover';
import LogDetails from './LogDetails';
import { format } from 'date-fns';

interface LogListProps {
  ledgerName: string;
  onBack?: () => void;
}

const LogList: React.FC<LogListProps> = ({ ledgerName, onBack }) => {
  const [pageSize, setPageSize] = useState(15);
  const [selectedLog, setSelectedLog] = useState<V2Log | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { data, isLoading, error, refetch } = useLogs(ledgerName, { pageSize });

  const handleViewLog = (log: V2Log) => {
    setSelectedLog(log);
    setIsPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
    setSelectedLog(null);
  };

  const columns = [
    {
      header: 'ID',
      accessor: (log: V2Log) => (
        <span className="font-mono text-sm text-gray-600">#{log.id}</span>
      ),
    },
    {
      header: 'Type',
      accessor: (log: V2Log) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          log.type === 'NEW_TRANSACTION' ? 'bg-green-100 text-green-800' :
          log.type === 'SET_METADATA' ? 'bg-blue-100 text-blue-800' :
          log.type === 'DELETE_METADATA' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {log.type}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: (log: V2Log) => (
        <span className="text-sm text-gray-600">
          {format(new Date(log.date), 'MMM dd, yyyy HH:mm:ss')}
        </span>
      ),
    },
    {
      header: 'Hash',
      accessor: (log: V2Log) => (
        <span className="font-mono text-xs text-gray-500 truncate max-w-32">
          {log.hash}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (log: V2Log) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          log.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {log.error ? 'Error' : 'Success'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: (log: V2Log) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleViewLog(log)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card title={`Logs - ${ledgerName}`}>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-sm">Loading logs...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load logs';
    return (
      <Card title={`Logs - ${ledgerName}`}>
        <div className="text-center py-8">
          <div className="mb-4">
            <div className="text-red-600 font-medium mb-2">Failed to load logs</div>
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

  const logs = data?.cursor.data || [];

  return (
    <div className="relative">
      <Card title={`Logs - ${ledgerName}`}>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              {logs.length} log{logs.length !== 1 ? 's' : ''} found
            </p>
          </div>
          {onBack && (
            <Button onClick={onBack} variant="secondary">
              Back
            </Button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <p className="text-gray-500 font-medium mb-2">No logs found</p>
              <p className="text-sm text-gray-400 max-w-md mx-auto">
                No log entries are available for this ledger.
              </p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={logs}
            keyExtractor={(log: V2Log) => log.id.toString()}
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

      <Popover
        isOpen={isPopoverOpen}
        onClose={handleClosePopover}
        title={`Log Details - #${selectedLog?.id}`}
      >
        {selectedLog && <LogDetails log={selectedLog} />}
      </Popover>
    </div>
  );
};

export default LogList; 