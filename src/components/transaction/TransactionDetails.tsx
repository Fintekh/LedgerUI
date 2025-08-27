import React, { useState } from 'react';
import { useTransaction, useAddTransactionMetadata, useDeleteTransactionMetadata, useRevertTransaction } from '../../services/api/transaction';
import { V2Transaction, V2Metadata } from '../../types/transaction';
import Button from '../common/Button';
import Card from '../common/Card';
import { format } from 'date-fns';

interface TransactionDetailsProps {
  ledgerName: string;
  transactionId: number;
  onBack?: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ 
  ledgerName, 
  transactionId, 
  onBack 
}) => {
  const [newMetadataKey, setNewMetadataKey] = useState('');
  const [newMetadataValue, setNewMetadataValue] = useState('');
  const [showAddMetadata, setShowAddMetadata] = useState(false);

  const { data, isLoading, error } = useTransaction(ledgerName, transactionId);
  const addMetadataMutation = useAddTransactionMetadata();
  const deleteMetadataMutation = useDeleteTransactionMetadata();
  const revertTransactionMutation = useRevertTransaction();

  const transaction = data?.data;

  const handleAddMetadata = () => {
    if (newMetadataKey.trim() && newMetadataValue.trim()) {
      addMetadataMutation.mutate({
        ledgerName,
        transactionId,
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
      transactionId,
      key
    });
  };

  const handleRevertTransaction = () => {
    if (window.confirm('Are you sure you want to revert this transaction? This action cannot be undone.')) {
      revertTransactionMutation.mutate({
        ledgerName,
        transactionId
      });
    }
  };

  if (isLoading) {
    return (
      <Card title={`Transaction ${transactionId}`}>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    const errorMessage = error?.response?.status === 404 
      ? `Transaction ${transactionId} not found in ledger "${ledgerName}"`
      : error?.response?.status === 405
      ? `API method not allowed for transaction ${transactionId}`
      : 'Failed to load transaction details';
    
    return (
      <Card title={`Transaction ${transactionId}`}>
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

  if (!transaction) {
    return (
      <Card title={`Transaction ${transactionId}`}>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Transaction not found</p>
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
    <Card title={`Transaction ${transaction.id}`}>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Ledger: {ledgerName}</p>
        </div>
        <div className="flex space-x-2">
          {!transaction.reverted && (
            <Button
              onClick={handleRevertTransaction}
              variant="danger"
              size="sm"
              disabled={revertTransactionMutation.isPending}
            >
              {revertTransactionMutation.isPending ? 'Reverting...' : 'Revert Transaction'}
            </Button>
          )}
          {onBack && (
            <Button onClick={onBack} variant="secondary" size="sm">
              Back
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">ID:</span>
              <span className="text-sm text-gray-900 font-mono">{transaction.id}</span>
            </div>
            {transaction.reference && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Reference:</span>
                <span className="text-sm text-gray-900">{transaction.reference}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                transaction.reverted 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {transaction.reverted ? 'Reverted' : 'Active'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-500">Timestamp:</span>
              <span className="text-sm text-gray-900">
                {format(new Date(transaction.timestamp), 'MMM dd, yyyy HH:mm:ss')}
              </span>
            </div>
            {transaction.insertedAt && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Created:</span>
                <span className="text-sm text-gray-900">
                  {format(new Date(transaction.insertedAt), 'MMM dd, yyyy HH:mm:ss')}
                </span>
              </div>
            )}
            {transaction.revertedAt && (
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">Reverted At:</span>
                <span className="text-sm text-gray-900">
                  {format(new Date(transaction.revertedAt), 'MMM dd, yyyy HH:mm:ss')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Postings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Postings</h3>
          <div className="space-y-3">
            {transaction.postings.map((posting, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Source:</span>
                    <span className="ml-2 font-mono text-gray-900">{posting.source}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Destination:</span>
                    <span className="ml-2 font-mono text-gray-900">{posting.destination}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Amount:</span>
                    <span className="ml-2 text-gray-900">{posting.amount}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Asset:</span>
                    <span className="ml-2 text-gray-900">{posting.asset}</span>
                  </div>
                </div>
              </div>
            ))}
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

          {Object.keys(transaction.metadata || {}).length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No metadata found
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                {Object.entries(transaction.metadata || {}).map(([key, value]) => (
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
        {transaction.postCommitVolumes && Object.keys(transaction.postCommitVolumes).length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Post-Commit Volumes</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                {Object.entries(transaction.postCommitVolumes).map(([account, assets]) => (
                  <div key={account} className="border-b border-gray-200 last:border-b-0 pb-2">
                    <div className="font-medium text-gray-700 mb-1">{account}:</div>
                    <div className="ml-4 space-y-1">
                      {Object.entries(assets).map(([asset, volume]) => (
                        <div key={asset} className="text-sm text-gray-600">
                          {asset}: Input {volume.input}, Output {volume.output}, Balance {volume.balance}
                        </div>
                      ))}
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

export default TransactionDetails; 