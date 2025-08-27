import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateLedger } from '../../services/api/ledger';
import { V2CreateLedgerRequest } from '../../types/ledger';
import Button from '../common/Button';
import Card from '../common/Card';

interface CreateLedgerFormData {
  name: string;
  bucket?: string;
}

interface LedgerCreateProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Validation regex matching backend rules
const LEDGER_NAME_REGEX = /^[0-9a-zA-Z_-]{1,63}$/;
const RESERVED_NAMES = ['_', '_info', '_healthcheck'];

const LedgerCreate: React.FC<LedgerCreateProps> = ({ onSuccess, onCancel }) => {
  const [metadataPairs, setMetadataPairs] = useState<Array<{ key: string; value: string }>>([]);
  const createLedgerMutation = useCreateLedger();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CreateLedgerFormData>({
    defaultValues: {
      name: '',
      bucket: '',
    },
  });

  const watchedName = watch('name');

  const validateLedgerName = (name: string) => {
    if (!name) return 'Ledger name is required';
    if (name.length > 63) return 'Ledger name must be 63 characters or less';
    if (!LEDGER_NAME_REGEX.test(name)) {
      return 'Ledger name can only contain letters, numbers, hyphens, and underscores';
    }
    if (RESERVED_NAMES.includes(name)) {
      return `Ledger name '${name}' is reserved and cannot be used`;
    }
    return true;
  };

  const onSubmit = async (data: CreateLedgerFormData) => {
    try {
      const metadata = metadataPairs.reduce((acc, pair) => {
        if (pair.key && pair.value) {
          acc[pair.key] = pair.value;
        }
        return acc;
      }, {} as Record<string, string>);

      const requestData: V2CreateLedgerRequest = {
        bucket: data.bucket || undefined,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      };

      await createLedgerMutation.mutateAsync({
        ledgerName: data.name,
        data: requestData,
      });

      reset();
      setMetadataPairs([]);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create ledger:', error);
    }
  };

  const addMetadataPair = () => {
    setMetadataPairs([...metadataPairs, { key: '', value: '' }]);
  };

  const removeMetadataPair = (index: number) => {
    setMetadataPairs(metadataPairs.filter((_, i) => i !== index));
  };

  const updateMetadataPair = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...metadataPairs];
    updated[index][field] = value;
    setMetadataPairs(updated);
  };

  return (
    <Card title="Create New Ledger">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Ledger Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Ledger Name *
          </label>
          <input
            {...register('name', { 
              required: 'Ledger name is required',
              validate: validateLedgerName
            })}
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter ledger name (e.g., main, production-ledger)"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
          {watchedName && !errors.name && (
            <p className="mt-1 text-sm text-green-600">
              ✓ Valid ledger name format
            </p>
          )}
          <div className="mt-2 text-xs text-gray-500">
            <p>• 1-63 characters</p>
            <p>• Letters, numbers, hyphens, and underscores only</p>
            <p>• Cannot use reserved names: _, _info, _healthcheck</p>
          </div>
        </div>

        {/* Bucket */}
        <div>
          <label htmlFor="bucket" className="block text-sm font-medium text-gray-700 mb-1">
            Bucket (Optional)
          </label>
          <input
            {...register('bucket', {
              pattern: {
                value: LEDGER_NAME_REGEX,
                message: 'Bucket name can only contain letters, numbers, hyphens, and underscores'
              },
              maxLength: {
                value: 63,
                message: 'Bucket name must be 63 characters or less'
              }
            })}
            type="text"
            id="bucket"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter bucket name (defaults to _default)"
          />
          {errors.bucket && (
            <p className="mt-1 text-sm text-red-600">{errors.bucket.message}</p>
          )}
          <div className="mt-2 text-xs text-gray-500">
            <p>• Same format as ledger name</p>
            <p>• Defaults to "_default" if not specified</p>
          </div>
        </div>

        {/* Metadata */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Metadata (Optional)
            </label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addMetadataPair}
            >
              Add Metadata
            </Button>
          </div>
          
          {metadataPairs.length === 0 ? (
            <p className="text-sm text-gray-500">No metadata added</p>
          ) : (
            <div className="space-y-2">
              {metadataPairs.map((pair, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Key"
                    value={pair.key}
                    onChange={(e) => updateMetadataPair(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={pair.value}
                    onChange={(e) => updateMetadataPair(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeMetadataPair(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Create Ledger
          </Button>
        </div>

        {createLedgerMutation.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              Failed to create ledger. Please try again.
            </p>
          </div>
        )}
      </form>
    </Card>
  );
};

export default LedgerCreate; 