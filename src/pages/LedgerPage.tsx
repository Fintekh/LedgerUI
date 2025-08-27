import React, { useState } from 'react';
import { V2Ledger } from '../types/ledger';
import LedgerList from '../components/ledger/LedgerList';
import LedgerCreate from '../components/ledger/LedgerCreate';
import LedgerDetails from '../components/ledger/LedgerDetails';
import Layout from '../components/common/Layout';

type View = 'list' | 'create' | 'details';

const LedgerPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedLedger, setSelectedLedger] = useState<V2Ledger | null>(null);

  const handleCreateLedger = () => {
    setCurrentView('create');
  };

  const handleLedgerSelect = (ledger: V2Ledger) => {
    setSelectedLedger(ledger);
    setCurrentView('details');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedLedger(null);
  };

  const handleCreateSuccess = () => {
    setCurrentView('list');
  };

  const handleCreateCancel = () => {
    setCurrentView('list');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {currentView === 'list' && (
          <LedgerList
            onLedgerSelect={handleLedgerSelect}
            onCreateLedger={handleCreateLedger}
          />
        )}

        {currentView === 'create' && (
          <LedgerCreate
            onSuccess={handleCreateSuccess}
            onCancel={handleCreateCancel}
          />
        )}

        {currentView === 'details' && selectedLedger && (
          <LedgerDetails
            ledgerName={selectedLedger.name}
            onBack={handleBackToList}
          />
        )}
      </div>
    </Layout>
  );
};

export default LedgerPage; 