import React, { useState } from 'react';
import { useAccount, useAddAccountMetadata, useDeleteAccountMetadata } from '../../services/api/account';
import { V2Account, V2Metadata } from '../../types/account';
import Button from '../common/Button';
import Card from '../common/Card';
import { format } from 'date-fns';

interface AccountDetailsProps {
  ledgerName: string;
  accountAddress: string;
  onBack?: () => void;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({ 
  ledgerName, 
  accountAddress, 
  onBack 
}) => {
  const [newMetadataKey, setNewMetadataKey] = useState('');
  const [newMetadataValue, setNewMetadataValue] = useState('');
  const [showAddMetadata, setShowAddMetadata] = useState(false);

  const { data, isLoading, error } = useAccount(ledgerName, accountAddress);
  const addMetadataMutation = useAddAccountMetadata();
  const deleteMetadataMutation = useDeleteAccountMetadata();

  const account = data?.data;

  const handleAddMetadata = () => {
    if (newMetadataKey.trim() && newMetadataValue.trim()) {
      addMetadataMutation.mutate({
        ledgerName,
        address: accountAddress,
        metadata: { [newMetadataKey.trim()]: newMetadataValue.trim() }
      }, {
        onSuccess: () => {
          setNewMetadataKey('');
          setNewMetadataValue('');
          setShowAddMetadata(false);
        }
      });
    }
  };

  const handleDeleteMetadata = (key: string) => {
    deleteMetadataMutation.mutate({
      ledgerName,
      address: accountAddress,
      key
    });
  };

  if (isLoading) {
    return (
      <Card title={`Account: ${accountAddress}`}>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    const errorMessage = error?.response?.status === 404 
      ? `Account "${accountAddress}" not found in ledger "${ledgerName}"`
      : error?.response?.status === 405
      ? `API method not allowed for account "${accountAddress}"`
      : 'Failed to load account details';
    
    return (
      <Card title={`Account: ${accountAddress}`}>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{errorMessage}</p>
          {onBack && (
            <Button onClick={onBack} variant="secondary">
              Back
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (!account) {
    return (
      <Card title={`Account: ${accountAddress}`}>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Account not found</p>
          {onBack && (
            <Button onClick={onBack} variant="secondary">
              Back
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card title={`Account: ${accountAddress}`}>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Ledger: {ledgerName}</p>
        </div>
        {onBack && (
          <Button onClick={onBack} variant="secondary" size="sm">
            Back
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Address:</span>
              <span className="text-sm text-gray-900 font-mono">{account.address}</span>
            </div>
            {account.insertionDate && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Created:</span>
                <span className="text-sm text-gray-900">
                  {format(new Date(account.insertionDate), 'MMM dd, yyyy HH:mm:ss')}
                </span>
              </div>
            )}
            {account.updatedAt && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Updated:</span>
                <span className="text-sm text-gray-900">
                  {format(new Date(account.updatedAt), 'MMM dd, yyyy HH:mm:ss')}
                </span>
              </div>
            )}
            {account.firstUsage && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">First Usage:</span>
                <span className="text-sm text-gray-900">
                  {format(new Date(account.firstUsage), 'MMM dd, yyyy HH:mm:ss')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-900">Metadata</h3>
            <Button
              onClick={() => setShowAddMetadata(!showAddMetadata)}
              variant="secondary"
              size="sm"
            >
              {showAddMetadata ? 'Cancel' : 'Add Metadata'}
            </Button>
          </div>

          {showAddMetadata && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key
                  </label>
                  <input
                    type="text"
                    value={newMetadataKey}
                    onChange={(e) => setNewMetadataKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Enter metadata key"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={newMetadataValue}
                    onChange={(e) => setNewMetadataValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Enter metadata value"
                  />
                </div>
              </div>
              <div className="mt-3">
                <Button
                  onClick={handleAddMetadata}
                  disabled={!newMetadataKey.trim() || !newMetadataValue.trim() || addMetadataMutation.isPending}
                  variant="primary"
                  size="sm"
                >
                  {addMetadataMutation.isPending ? 'Adding...' : 'Add Metadata'}
                </Button>
              </div>
            </div>
          )}

          {Object.keys(account.metadata || {}).length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No metadata found
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                {Object.entries(account.metadata || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <span className="text-sm font-medium text-gray-700">{key}:</span>
                      <span className="text-sm text-gray-900 ml-2">{value}</span>
                    </div>
                    <Button
                      onClick={() => handleDeleteMetadata(key)}
                      disabled={deleteMetadataMutation.isPending}
                      variant="danger"
                      size="sm"
                    >
                      {deleteMetadataMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Volumes (if available) */}
        {account.volumes && Object.keys(account.volumes).length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Volumes</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                {Object.entries(account.volumes).map(([asset, volume]) => (
                  <div key={asset} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span className="text-sm font-medium text-gray-700">{asset}:</span>
                    <div className="text-sm text-gray-900">
                      <span className="mr-4">Input: {volume.input}</span>
                      <span className="mr-4">Output: {volume.output}</span>
                      <span className="font-medium">Balance: {volume.balance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AccountDetails; 