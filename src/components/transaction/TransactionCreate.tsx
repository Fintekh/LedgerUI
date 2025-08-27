import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useCreateTransaction } from '../../services/api/transaction';
import { useAccounts } from '../../services/api/account';
import { V2PostTransaction, V2Posting, V2Metadata } from '../../types/transaction';
import Button from '../common/Button';
import Card from '../common/Card';

interface TransactionCreateProps {
  ledgerName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface TransactionFormData {
  reference?: string;
  postings: {
    source: string;
    destination: string;
    amount: number;
    asset: string;
  }[];
  metadata: { key: string; value: string }[];
}

interface TransactionTemplate {
  name: string;
  description: string;
  postings: {
    source: string;
    destination: string;
    amount: number;
    asset: string;
  }[];
  metadata: { key: string; value: string }[];
}

// Generate random reference number
const generateReferenceNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN-${timestamp}-${random}`;
};

// Generate random metadata
const generateRandomMetadata = (): { key: string; value: string }[] => {
  const metadataOptions = [
    { key: 'transaction_type', value: 'payment' },
    { key: 'transaction_type', value: 'transfer' },
    { key: 'transaction_type', value: 'deposit' },
    { key: 'transaction_type', value: 'withdrawal' },
    { key: 'payment_method', value: 'ACH' },
    { key: 'payment_method', value: 'RTP' },
    { key: 'payment_method', value: 'Wire' },
    { key: 'payment_method', value: 'FedNow' },
    { key: 'business_category', value: 'Technology' },
    { key: 'business_category', value: 'Healthcare' },
    { key: 'business_category', value: 'Finance' },
    { key: 'business_category', value: 'Retail' },
    { key: 'business_category', value: 'Manufacturing' },
    { key: 'transaction_purpose', value: 'Payment for Services' },
    { key: 'transaction_purpose', value: 'Product Purchase' },
    { key: 'transaction_purpose', value: 'Subscription Payment' },
    { key: 'transaction_purpose', value: 'Salary Payment' },
    { key: 'transaction_purpose', value: 'Vendor Payment' },
    { key: 'reference_id', value: Math.random().toString(36).substring(2, 12).toUpperCase() },
    { key: 'timestamp', value: new Date().toISOString() }
  ];

  // Pick 2-4 random metadata items
  const count = Math.floor(Math.random() * 3) + 2;
  const shuffled = [...metadataOptions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const TransactionCreate: React.FC<TransactionCreateProps> = ({ 
  ledgerName, 
  onSuccess, 
  onCancel 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [filterStates, setFilterStates] = useState<{ [key: string]: string }>({});
  const createTransactionMutation = useCreateTransaction();

  // Fetch accounts for dropdowns
  const { data: accountsData, isLoading: accountsLoading } = useAccounts(ledgerName, { pageSize: 100 });
  const accounts = accountsData?.cursor?.data || [];

  const { register, control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<TransactionFormData>({
    defaultValues: {
      reference: generateReferenceNumber(),
      postings: [
        { source: 'world', destination: 'users:001', amount: 100, asset: 'USD' }
      ],
      metadata: generateRandomMetadata()
    }
  });

  const { fields: postingFields, append: appendPosting, remove: removePosting, replace: replacePostings } = useFieldArray({
    control,
    name: 'postings'
  });

  const { fields: metadataFields, append: appendMetadata, remove: removeMetadata, replace: replaceMetadata } = useFieldArray({
    control,
    name: 'metadata'
  });

  const watchedPostings = watch('postings');

  // Auto-generate reference and metadata on component mount
  useEffect(() => {
    setValue('reference', generateReferenceNumber());
    setValue('metadata', generateRandomMetadata());
  }, [setValue]);

  // Helper function to get filter state for a specific field
  const getFilterState = (fieldType: 'source' | 'destination', index: number) => {
    const key = `${fieldType}_${index}`;
    return filterStates[key] || '';
  };

  // Helper function to set filter state for a specific field
  const setFilterState = (fieldType: 'source' | 'destination', index: number, value: string) => {
    const key = `${fieldType}_${index}`;
    setFilterStates(prev => ({ ...prev, [key]: value }));
  };

  // Helper function to clear filter state for a specific field
  const clearFilterState = (fieldType: 'source' | 'destination', index: number) => {
    const key = `${fieldType}_${index}`;
    setFilterStates(prev => ({ ...prev, [key]: '' }));
  };

  // Transaction templates
  const templates: TransactionTemplate[] = [
    {
      name: 'Create User Account',
      description: 'Create a new user account with initial funds',
      postings: [
        { source: 'world', destination: 'users:001', amount: 1000, asset: 'USD' }
      ],
      metadata: [
        { key: 'type', value: 'user_creation' },
        { key: 'description', value: 'Initial user account setup' }
      ]
    },
    {
      name: 'Bank Transfer',
      description: 'Transfer funds between bank accounts',
      postings: [
        { source: 'bank:checking', destination: 'bank:savings', amount: 500, asset: 'USD' }
      ],
      metadata: [
        { key: 'type', value: 'transfer' },
        { key: 'description', value: 'Internal bank transfer' }
      ]
    },
    {
      name: 'Payment Processing',
      description: 'Process a payment from user to merchant',
      postings: [
        { source: 'users:001', destination: 'merchants:store', amount: 50, asset: 'USD' }
      ],
      metadata: [
        { key: 'type', value: 'payment' },
        { key: 'description', value: 'Payment to merchant' }
      ]
    }
  ];

  const applyTemplate = (template: TransactionTemplate) => {
    replacePostings(template.postings);
    replaceMetadata(template.metadata);
    setValue('reference', generateReferenceNumber());
    setShowTemplates(false);
  };

  const regenerateReference = () => {
    setValue('reference', generateReferenceNumber());
  };

  const regenerateMetadata = () => {
    setValue('metadata', generateRandomMetadata());
  };

  const validatePostings = (postings: any[]) => {
    if (!postings || postings.length === 0) {
      return 'At least one posting is required';
    }

    for (let i = 0; i < postings.length; i++) {
      const posting = postings[i];
      if (!posting.source || !posting.destination || !posting.asset) {
        return 'All posting fields are required';
      }
      if (posting.amount <= 0) {
        return 'Amount must be greater than 0';
      }
    }

    return true;
  };

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    
    try {
      // Convert form data to API format
      const postings: V2Posting[] = data.postings.map(posting => ({
        source: posting.source,
        destination: posting.destination,
        amount: posting.amount,
        asset: posting.asset
      }));

      const metadata: V2Metadata = {};
      data.metadata.forEach(item => {
        if (item.key && item.value) {
          metadata[item.key] = item.value;
        }
      });

      const transaction: V2PostTransaction = {
        postings,
        metadata,
        reference: data.reference,
        timestamp: new Date().toISOString()
      };

      await createTransactionMutation.mutateAsync({
        ledgerName,
        transaction
      });

      // Reset form with new auto-generated values
      reset({
        reference: generateReferenceNumber(),
        postings: [{ source: 'world', destination: 'users:001', amount: 100, asset: 'USD' }],
        metadata: generateRandomMetadata()
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPosting = () => {
    appendPosting({ source: 'world', destination: '', amount: 0, asset: 'USD' });
  };

  const addMetadata = () => {
    appendMetadata({ key: '', value: '' });
  };

  return (
    <Card title="Create Transaction">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Templates */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Quick Templates</h3>
            <Button
              type="button"
              onClick={() => setShowTemplates(!showTemplates)}
              variant="secondary"
              size="sm"
            >
              {showTemplates ? 'Hide Templates' : 'Show Templates'}
            </Button>
          </div>

          {showTemplates && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {templates.map((template, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    <div className="font-medium">Postings:</div>
                    {template.postings.map((posting, idx) => (
                      <div key={idx} className="ml-2">
                        {posting.source} → {posting.destination}: {posting.amount} {posting.asset}
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={() => applyTemplate(template)}
                    variant="primary"
                    size="sm"
                  >
                    Use Template
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reference */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Reference (Optional)
            </label>
            <Button
              type="button"
              onClick={regenerateReference}
              variant="secondary"
              size="sm"
            >
              🔄 Generate New
            </Button>
          </div>
          <input
            type="text"
            {...register('reference')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Auto-generated reference"
          />
        </div>

        {/* Postings */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Postings</h3>
            <Button
              type="button"
              onClick={addPosting}
              variant="secondary"
              size="sm"
            >
              Add Posting
            </Button>
          </div>

          <div className="space-y-4">
            {postingFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Posting {index + 1}</h4>
                  {postingFields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removePosting(index)}
                      variant="danger"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source Account
                    </label>
                    <div className="relative">
                      <div className="flex">
                        <input
                          type="text"
                          {...register(`postings.${index}.source` as const, { required: true })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="world"
                          onChange={(e) => {
                            // Update the form value
                            setValue(`postings.${index}.source` as const, e.target.value);
                            // Update the filter state to show dropdown
                            setFilterState('source', index, e.target.value);
                          }}
                          onFocus={() => {
                            // Show dropdown when focused
                            setFilterState('source', index, '');
                          }}
                          onBlur={() => {
                            // Clear filter after a short delay to allow dropdown clicks
                            setTimeout(() => clearFilterState('source', index), 200);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // Show all accounts when browse button is clicked
                            setFilterState('source', index, ' ');
                          }}
                          className="ml-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-600"
                          title="Browse accounts"
                        >
                          📋
                        </button>
                      </div>
                      {(getFilterState('source', index) !== '' || getFilterState('source', index) === ' ') && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {accountsLoading ? (
                            <div className="px-3 py-2 text-gray-500 text-sm">
                              Loading accounts...
                            </div>
                          ) : accounts
                            .filter(account => {
                              const filter = getFilterState('source', index);
                              return filter === ' ' || account.address.toLowerCase().includes(filter.toLowerCase());
                            })
                            .slice(0, 5)
                            .map((account) => (
                              <div
                                key={account.address}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => {
                                  setValue(`postings.${index}.source` as const, account.address);
                                  clearFilterState('source', index);
                                }}
                              >
                                {account.address}
                              </div>
                            ))}
                          {!accountsLoading && accounts.filter(account => {
                            const filter = getFilterState('source', index);
                            return filter === ' ' || account.address.toLowerCase().includes(filter.toLowerCase());
                          }).length === 0 && (
                            <div className="px-3 py-2 text-gray-500 text-sm">
                              No accounts found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Use world for new accounts or existing account addresses
                      {accounts.length > 0 ? (
                        <span className="ml-2 text-blue-600">
                          ({accounts.length} accounts available)
                        </span>
                      ) : (
                        <span className="ml-2 text-orange-600">
                          (No accounts yet - use 'world' to create new ones)
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination Account
                    </label>
                    <div className="relative">
                      <div className="flex">
                        <input
                          type="text"
                          {...register(`postings.${index}.destination` as const, { required: true })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="users:001"
                          onChange={(e) => {
                            // Update the form value
                            setValue(`postings.${index}.destination` as const, e.target.value);
                            // Update the filter state to show dropdown
                            setFilterState('destination', index, e.target.value);
                          }}
                          onFocus={() => {
                            // Show dropdown when focused
                            setFilterState('destination', index, '');
                          }}
                          onBlur={() => {
                            // Clear filter after a short delay to allow dropdown clicks
                            setTimeout(() => clearFilterState('destination', index), 200);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // Show all accounts when browse button is clicked
                            setFilterState('destination', index, ' ');
                          }}
                          className="ml-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-600"
                          title="Browse accounts"
                        >
                          📋
                        </button>
                      </div>
                      {(getFilterState('destination', index) !== '' || getFilterState('destination', index) === ' ') && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                          {accountsLoading ? (
                            <div className="px-3 py-2 text-gray-500 text-sm">
                              Loading accounts...
                            </div>
                          ) : accounts
                            .filter(account => {
                              const filter = getFilterState('destination', index);
                              return filter === ' ' || account.address.toLowerCase().includes(filter.toLowerCase());
                            })
                            .slice(0, 5)
                            .map((account) => (
                              <div
                                key={account.address}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => {
                                  setValue(`postings.${index}.destination` as const, account.address);
                                  clearFilterState('destination', index);
                                }}
                              >
                                {account.address}
                              </div>
                            ))}
                          {!accountsLoading && accounts.filter(account => {
                            const filter = getFilterState('destination', index);
                            return filter === ' ' || account.address.toLowerCase().includes(filter.toLowerCase());
                          }).length === 0 && (
                            <div className="px-3 py-2 text-gray-500 text-sm">
                              No accounts found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Select existing account or enter new account address
                      {accounts.length > 0 ? (
                        <span className="ml-2 text-blue-600">
                          ({accounts.length} accounts available)
                        </span>
                      ) : (
                        <span className="ml-2 text-orange-600">
                          (No accounts yet - enter new account address)
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      {...register(`postings.${index}.amount` as const, { 
                        required: true, 
                        min: 1,
                        valueAsNumber: true 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset
                    </label>
                    <input
                      type="text"
                      {...register(`postings.${index}.asset` as const, { required: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="USD"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.postings && (
            <p className="text-red-600 text-sm mt-2">{errors.postings.message}</p>
          )}
        </div>

        {/* Metadata */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Metadata (Optional)</h3>
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={regenerateMetadata}
                variant="secondary"
                size="sm"
              >
                🔄 Generate Random
              </Button>
              <Button
                type="button"
                onClick={addMetadata}
                variant="secondary"
                size="sm"
              >
                Add Metadata
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {metadataFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2">
                <input
                  type="text"
                  {...register(`metadata.${index}.key` as const)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Key"
                />
                <input
                  type="text"
                  {...register(`metadata.${index}.value` as const)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Value"
                />
                <Button
                  type="button"
                  onClick={() => removeMetadata(index)}
                  variant="danger"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Account Creation Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Account Creation Guide</h4>
          <p className="text-sm text-blue-700 mb-3">
            Accounts are created automatically when transactions are posted to them. Use these patterns:
          </p>
          <div className="space-y-2 text-sm text-blue-600">
            <div><strong>New Account Creation:</strong> Use world as source to create new accounts</div>
            <div><strong>Transfer Between Accounts:</strong> Use existing account addresses</div>
            <div><strong>Account Naming:</strong> Use format like users:001, bank:main, etc.</div>
          </div>
          <div className="mt-3 p-3 bg-blue-100 rounded">
            <p className="text-sm text-blue-800 font-medium">This transaction will create:</p>
            <div className="mt-2 space-y-1">
              {watchedPostings?.map((posting, index) => (
                <div key={index} className="text-sm text-blue-700">
                  • <span className="font-mono">{posting.destination}</span> (from {posting.source})
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {createTransactionMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">Transaction Error</h4>
            <p className="text-sm text-red-700">
              {createTransactionMutation.error?.response?.data?.errorMessage || 
               createTransactionMutation.error?.message || 
               'Failed to create transaction'}
            </p>
            {createTransactionMutation.error?.response?.data?.errorCode === 'INSUFFICIENT_FUND' && (
              <p className="text-sm text-red-600 mt-2">
                💡 Tip: Use @world as the source account to create new accounts with initial funds.
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Transaction'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TransactionCreate; 