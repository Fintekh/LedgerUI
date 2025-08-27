import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { V2Ledger } from '../types/ledger';
import { V2Transaction } from '../types/transaction';
import LedgerList from '../components/ledger/LedgerList';
import TransactionList from '../components/transaction/TransactionList';
import TransactionCreate from '../components/transaction/TransactionCreate';
import TransactionDetails from '../components/transaction/TransactionDetails';
import Layout from '../components/common/Layout';

type View = 'select-ledger' | 'transactions' | 'create-transaction' | 'transaction-details';

const TransactionsPage: React.FC = () => {
  const { ledgerName, transactionId } = useParams<{ ledgerName?: string; transactionId?: string }>();
  const navigate = useNavigate();
  
  const [currentView, setCurrentView] = useState<View>(
    ledgerName 
      ? (transactionId ? 'transaction-details' : 'transactions')
      : 'select-ledger'
  );
  const [selectedLedger, setSelectedLedger] = useState<V2Ledger | null>(
    ledgerName ? { name: ledgerName } as V2Ledger : null
  );
  const [selectedTransaction, setSelectedTransaction] = useState<V2Transaction | null>(
    transactionId ? { id: parseInt(transactionId) } as V2Transaction : null
  );

  const handleLedgerSelect = (ledger: V2Ledger) => {
    setSelectedLedger(ledger);
    setCurrentView('transactions');
    navigate(`/transactions/${ledger.name}`);
  };

  const handleTransactionSelect = (transaction: V2Transaction) => {
    setSelectedTransaction(transaction);
    setCurrentView('transaction-details');
    navigate(`/transactions/${selectedLedger?.name}/${transaction.id}`);
  };

  const handleCreateTransaction = () => {
    setCurrentView('create-transaction');
  };

  const handleBackToLedgers = () => {
    setSelectedLedger(null);
    setSelectedTransaction(null);
    setCurrentView('select-ledger');
    navigate('/transactions');
  };

  const handleBackToTransactions = () => {
    setSelectedTransaction(null);
    setCurrentView('transactions');
    navigate(`/transactions/${selectedLedger?.name}`);
  };

  const handleCreateSuccess = () => {
    setCurrentView('transactions');
    navigate(`/transactions/${selectedLedger?.name}`);
  };

  const handleCreateCancel = () => {
    setCurrentView('transactions');
    navigate(`/transactions/${selectedLedger?.name}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {currentView === 'select-ledger' && (
          <div className="text-center py-8">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a Ledger to View Transactions
              </h3>
              <p className="text-gray-600">
                Choose a ledger from the list to view and manage its transactions.
              </p>
            </div>
            
            <LedgerList 
              onLedgerSelect={handleLedgerSelect}
            />
          </div>
        )}
        
        {currentView === 'transactions' && selectedLedger && (
          <TransactionList
            ledgerName={selectedLedger.name}
            onTransactionSelect={handleTransactionSelect}
            onBackToLedgers={handleBackToLedgers}
            onCreateTransaction={handleCreateTransaction}
          />
        )}
        
        {currentView === 'create-transaction' && selectedLedger && (
          <TransactionCreate
            ledgerName={selectedLedger.name}
            onSuccess={handleCreateSuccess}
            onCancel={handleCreateCancel}
          />
        )}
        
        {currentView === 'transaction-details' && selectedLedger && selectedTransaction && (
          <TransactionDetails
            ledgerName={selectedLedger.name}
            transactionId={selectedTransaction.id}
            onBack={handleBackToTransactions}
          />
        )}
      </div>
    </Layout>
  );
};

export default TransactionsPage; 