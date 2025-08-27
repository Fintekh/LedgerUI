import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { V2Ledger } from '../types/ledger';
import LedgerList from '../components/ledger/LedgerList';
import LogList from '../components/ledger/LogList';
import Layout from '../components/common/Layout';

type View = 'select-ledger' | 'logs';

const LogsPage: React.FC = () => {
  const { ledgerName } = useParams<{ ledgerName?: string }>();
  const navigate = useNavigate();
  
  const [currentView, setCurrentView] = useState<View>(
    ledgerName ? 'logs' : 'select-ledger'
  );
  const [selectedLedger, setSelectedLedger] = useState<V2Ledger | null>(
    ledgerName ? { name: ledgerName } as V2Ledger : null
  );

  const handleLedgerSelect = (ledger: V2Ledger) => {
    setSelectedLedger(ledger);
    setCurrentView('logs');
    navigate(`/logs/${ledger.name}`);
  };

  const handleBackToLedgers = () => {
    setSelectedLedger(null);
    setCurrentView('select-ledger');
    navigate('/logs');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {currentView === 'select-ledger' && (
          <div className="text-center py-8">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a Ledger to View Logs
              </h3>
              <p className="text-gray-600">
                Choose a ledger from the list to view transaction and metadata logs.
              </p>
            </div>
            
            <LedgerList 
              onLedgerSelect={handleLedgerSelect}
            />
          </div>
        )}
        
        {currentView === 'logs' && selectedLedger && (
          <LogList
            ledgerName={selectedLedger.name}
            onBack={handleBackToLedgers}
          />
        )}
      </div>
    </Layout>
  );
};

export default LogsPage; 