import { generateCompleteSampleData, SampleDataConfig } from '../../services/sampleDataGenerator';
import { useCreateLedger } from './ledger';
import { useCreateTransaction } from './transaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// API service for creating sample data
export const sampleDataApi = {
  // Create sample data for a specific configuration
  createSampleData: async (config: SampleDataConfig) => {
    const sampleData = await generateCompleteSampleData(config);
    
    const results = {
      ledgers: [] as string[],
      accounts: [] as string[],
      transactions: [] as string[],
      errors: [] as string[]
    };

    // Create ledgers first
    for (const ledgerName of sampleData.ledgers) {
      try {
        // Note: We'll need to implement ledger creation API
        // For now, we'll assume ledgers exist or create them via transactions
        results.ledgers.push(ledgerName);
      } catch (error) {
        results.errors.push(`Failed to create ledger ${ledgerName}: ${error}`);
      }
    }

    // Create accounts and transactions
    for (const ledgerData of sampleData.data) {
      const { ledgerName, accounts, transactions } = ledgerData;

      // Create accounts (via transactions to @world)
      for (const account of accounts) {
        try {
          // Create account by posting to it from @world
          const createAccountTransaction = {
            postings: [{
              source: '@world',
              destination: account.address,
              amount: 1000, // Initial balance
              asset: 'USD'
            }],
            metadata: account.metadata,
            reference: `CREATE-${account.address}`,
            timestamp: new Date().toISOString()
          };

          // We'll need to implement this API call
          // await transactionApi.createTransaction(ledgerName, createAccountTransaction);
          results.accounts.push(account.address);
        } catch (error) {
          results.errors.push(`Failed to create account ${account.address}: ${error}`);
        }
      }

      // Create transactions
      for (const transaction of transactions) {
        try {
          // We'll need to implement this API call
          // await transactionApi.createTransaction(ledgerName, transaction);
          results.transactions.push(transaction.reference || 'TXN-' + Math.random().toString(36).substr(2, 9));
        } catch (error) {
          results.errors.push(`Failed to create transaction ${transaction.reference}: ${error}`);
        }
      }
    }

    return {
      ...sampleData,
      results
    };
  }
};

// React Query hook for creating sample data
export const useCreateSampleData = () => {
  const queryClient = useQueryClient();
  const createLedgerMutation = useCreateLedger();
  const createTransactionMutation = useCreateTransaction();

  return useMutation({
    mutationFn: async (config: SampleDataConfig) => {
      const sampleData = await generateCompleteSampleData(config);
      
      const results = {
        ledgers: [] as string[],
        accounts: [] as string[],
        transactions: [] as string[],
        errors: [] as string[]
      };

      // Create ledgers first
      for (const ledgerName of sampleData.ledgers) {
        try {
          console.log('Creating ledger:', ledgerName);
          // Create ledger if it doesn't exist
          await createLedgerMutation.mutateAsync({
            ledgerName: ledgerName,
            data: {
              metadata: {
                type: 'payment_processing',
                created_by: 'sample_data_generator',
                created_at: new Date().toISOString()
              }
            }
          });
          console.log('Successfully created ledger:', ledgerName);
          results.ledgers.push(ledgerName);
        } catch (error: any) {
          console.error('Failed to create ledger:', ledgerName, error);
          // If ledger already exists, that's fine - we can still use it
          if (error?.response?.status === 409 || 
              error?.response?.data?.errorCode === 'LEDGER_ALREADY_EXISTS') {
            console.log('Ledger already exists, continuing:', ledgerName);
            results.ledgers.push(ledgerName);
          } else {
            results.errors.push(`Failed to create ledger ${ledgerName}: ${error?.response?.data?.errorMessage || error?.message || error}`);
          }
        }
      }

      // Create accounts and transactions
      for (const ledgerData of sampleData.data) {
        const { ledgerName, accounts, transactions } = ledgerData;

        // Create accounts (via transactions to world)
        for (const account of accounts) {
          try {
            console.log('Creating account:', account.address, 'in ledger:', ledgerName);
            // Create account by posting to it from world
            const createAccountTransaction = {
              postings: [{
                source: 'world',
                destination: account.address,
                amount: 1000, // Initial balance
                asset: 'USD'
              }],
              metadata: account.metadata,
              reference: `CREATE-${account.address}`,
              timestamp: new Date().toISOString()
            };

            console.log('Account creation transaction:', createAccountTransaction);
            await createTransactionMutation.mutateAsync({
              ledgerName,
              transaction: createAccountTransaction
            });
            console.log('Successfully created account:', account.address);
            results.accounts.push(account.address);
          } catch (error: any) {
            console.error('Failed to create account:', account.address, 'Error:', error);
            console.error('Error response:', error?.response?.data);
            results.errors.push(`Failed to create account ${account.address}: ${error?.response?.data?.errorMessage || error?.message || error}`);
          }
        }

        // Create transactions
        for (const transaction of transactions) {
          try {
            console.log('Creating transaction:', transaction.reference, 'in ledger:', ledgerName);
            console.log('Transaction data:', transaction);
            console.log('Postings:', transaction.postings);
            console.log('Metadata:', transaction.metadata);
            await createTransactionMutation.mutateAsync({
              ledgerName,
              transaction
            });
            console.log('Successfully created transaction:', transaction.reference);
            results.transactions.push(transaction.reference || 'TXN-' + Math.random().toString(36).substr(2, 9));
          } catch (error: any) {
            console.error('Failed to create transaction:', transaction.reference, 'Error:', error);
            console.error('Error response:', error?.response?.data);
            console.error('Full error:', error);
            results.errors.push(`Failed to create transaction ${transaction.reference}: ${error?.response?.data?.errorMessage || error?.message || error}`);
          }
        }
      }

      return {
        ...sampleData,
        results
      };
    },
    onSuccess: () => {
      // Invalidate all queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['ledgers'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });
}; 