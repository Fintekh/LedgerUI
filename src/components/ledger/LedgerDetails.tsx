import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLedger, useUpdateLedgerMetadata, useDeleteLedgerMetadata } from '../../services/api/ledger';
import { V2Ledger, V2Metadata } from '../../types/ledger';
import Button from '../common/Button';
import Card from '../common/Card';
import { format } from 'date-fns';

interface LedgerDetailsProps {
  ledgerName: string;
  onBack?: () => void;
}

const LedgerDetails: React.FC<LedgerDetailsProps> = ({ ledgerName, onBack }) => {
  const navigate = useNavigate();
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const [newMetadataKey, setNewMetadataKey] = useState('');
  const [newMetadataValue, setNewMetadataValue] = useState('');

  const { data, isLoading, error } = useLedger(ledgerName);
  const updateMetadataMutation = useUpdateLedgerMetadata();
  const deleteMetadataMutation = useDeleteLedgerMetadata();

  const handleAddMetadata = async () => {
    if (!newMetadataKey || !newMetadataValue) return;

    try {
      const currentMetadata = data?.data.metadata || {};
      const updatedMetadata = {
        ...currentMetadata,
        [newMetadataKey]: newMetadataValue,
      };

      await updateMetadataMutation.mutateAsync({
        ledgerName,
        metadata: updatedMetadata,
      });

      setNewMetadataKey('');
      setNewMetadataValue('');
    } catch (error) {
      console.error('Failed to add metadata:', error);
    }
  };

  const handleDeleteMetadata = async (key: string) => {
    try {
      await deleteMetadataMutation.mutateAsync({
        ledgerName,
        key,
      });
    } catch (error) {
      console.error('Failed to delete metadata:', error);
    }
  };

  const handleViewAccounts = () => {
    navigate(`/accounts/${ledgerName}`);
  };

  const handleViewTransactions = () => {
    navigate(`/transactions/${ledgerName}`);
  };

  if (isLoading) {
    return (
      <Card title="Ledger Details">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Ledger Details">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load ledger details</p>
          <Button onClick={onBack} variant="secondary">
            Go Back
          </Button>
        </div>
      </Card>
    );
  }

  const ledger = data?.data;

  if (!ledger) {
    return (
      <Card title="Ledger Details">
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Ledger not found</p>
          <Button onClick={onBack} variant="secondary">
            Go Back
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{ledger.name}</h1>
          <p className="text-gray-600">Ledger Details</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleViewAccounts} variant="primary">
            View Accounts
          </Button>
          <Button onClick={handleViewTransactions} variant="primary">
            View Transactions
          </Button>
          <Button onClick={onBack} variant="secondary">
            Back to Ledgers
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <Card title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-sm text-gray-900">{ledger.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bucket</label>
            <p className="mt-1 text-sm text-gray-900">{ledger.bucket}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Created</label>
            <p className="mt-1 text-sm text-gray-900">
              {format(new Date(ledger.addedAt), 'MMM dd, yyyy HH:mm:ss')}
            </p>
          </div>
          {ledger.id && (
            <div>
              <label className="block text-sm font-medium text-gray-700">ID</label>
              <p className="mt-1 text-sm text-gray-900">{ledger.id}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Features */}
      {ledger.features && Object.keys(ledger.features).length > 0 && (
        <Card title="Features">
          <div className="space-y-2">
            {Object.entries(ledger.features).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <span className="font-medium text-gray-700">{key}</span>
                <span className="text-sm text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Metadata */}
      <Card title="Metadata">
        <div className="space-y-4">
          {/* Add New Metadata */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Key"
                value={newMetadataKey}
                onChange={(e) => setNewMetadataKey(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Value"
                value={newMetadataValue}
                onChange={(e) => setNewMetadataValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                onClick={handleAddMetadata}
                disabled={!newMetadataKey || !newMetadataValue || updateMetadataMutation.isPending}
                variant="primary"
                size="sm"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Existing Metadata */}
          {ledger.metadata && Object.keys(ledger.metadata).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(ledger.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <span className="font-medium text-gray-700">{key}</span>
                    <span className="ml-2 text-sm text-gray-600">{value}</span>
                  </div>
                  <Button
                    onClick={() => handleDeleteMetadata(key)}
                    variant="danger"
                    size="sm"
                    disabled={deleteMetadataMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No metadata found</p>
          )}
        </div>
      </Card>

      {/* Error Messages */}
      {(updateMetadataMutation.error || deleteMetadataMutation.error) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            An error occurred while updating metadata. Please try again.
          </p>
        </div>
      )}
    </div>
  );
};

export default LedgerDetails; 