import React, { useState } from 'react';
import { useVolumes } from '../../services/api/ledger';
import { V2Volume, PaginationParams } from '../../types/ledger';
import Button from '../common/Button';
import Card from '../common/Card';
import DataTable from '../common/DataTable';

interface VolumeListProps {
  ledgerName: string;
  onBack?: () => void;
}

const VolumeList: React.FC<VolumeListProps> = ({ ledgerName, onBack }) => {
  const [pageSize, setPageSize] = useState(15);
  const { data, isLoading, error, refetch } = useVolumes(ledgerName, { pageSize });

  const columns = [
    {
      header: 'Account',
      accessor: (volume: V2Volume) => (
        <span className="font-medium text-gray-900">{volume.account}</span>
      ),
    },
    {
      header: 'Asset',
      accessor: (volume: V2Volume) => (
        <span className="text-gray-600">{volume.asset}</span>
      ),
    },
    {
      header: 'Input',
      accessor: (volume: V2Volume) => (
        <span className="font-mono text-green-600">
          {parseFloat(volume.input).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Output',
      accessor: (volume: V2Volume) => (
        <span className="font-mono text-red-600">
          {parseFloat(volume.output).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Net',
      accessor: (volume: V2Volume) => {
        const input = parseFloat(volume.input);
        const output = parseFloat(volume.output);
        const net = input - output;
        return (
          <span className={`font-mono ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {net.toLocaleString()}
          </span>
        );
      },
    },
    {
      header: 'Metadata',
      accessor: (volume: V2Volume) => (
        <div className="text-sm text-gray-500">
          {volume.metadata ? Object.keys(volume.metadata).length : 0} keys
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card title={`Volumes - ${ledgerName}`}>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-sm">Loading volumes...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load volumes';
    return (
      <Card title={`Volumes - ${ledgerName}`}>
        <div className="text-center py-8">
          <div className="mb-4">
            <div className="text-red-600 font-medium mb-2">Failed to load volumes</div>
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

  const volumes = data?.cursor.data || [];

  return (
    <Card title={`Volumes - ${ledgerName}`}>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">
            {volumes.length} volume{volumes.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {onBack && (
          <Button onClick={onBack} variant="secondary">
            Back
          </Button>
        )}
      </div>

      {volumes.length === 0 ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <p className="text-gray-500 font-medium mb-2">No volumes found</p>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              No volume data is available for this ledger.
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={volumes}
          keyExtractor={(volume: V2Volume) => `${volume.account}-${volume.asset}`}
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

export default VolumeList; 