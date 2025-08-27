import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { V2Ledger } from '../types/ledger';
import { V2Account } from '../types/account';
import AccountList from '../components/account/AccountList';
import AccountDetails from '../components/account/AccountDetails';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

type View = 'select-ledger' | 'accounts' | 'account-details';

const AccountsPage: React.FC = () => {
  const { ledgerName, accountAddress } = useParams<{ ledgerName?: string; accountAddress?: string }>();
  const navigate = useNavigate();
  
  const [currentView, setCurrentView] = useState<View>(
    ledgerName ? (accountAddress ? 'account-details' : 'accounts') : 'select-ledger'
  );
  const [selectedLedger, setSelectedLedger] = useState<V2Ledger | null>(
    ledgerName ? { name: ledgerName } as V2Ledger : null
  );
  const [selectedAccount, setSelectedAccount] = useState<V2Account | null>(
    accountAddress ? { address: accountAddress } as V2Account : null
  );

  const handleLedgerSelect = (ledger: V2Ledger) => {
    setSelectedLedger(ledger);
    setCurrentView('accounts');
    navigate(`/accounts/${ledger.name}`);
  };

  const handleAccountSelect = (account: V2Account) => {
    setSelectedAccount(account);
    setCurrentView('account-details');
    navigate(`/accounts/${selectedLedger?.name}/${account.address}`);
  };

  const handleBackToLedgers = () => {
    setSelectedLedger(null);
    setSelectedAccount(null);
    setCurrentView('select-ledger');
    navigate('/accounts');
  };

  const handleBackToAccounts = () => {
    setSelectedAccount(null);
    setCurrentView('accounts');
    navigate(`/accounts/${selectedLedger?.name}`);
  };

  const handleGoToLedgers = () => {
    navigate('/ledgers');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {currentView === 'select-ledger' && (
          <Card title="Account Management">
            <div className="text-center py-8">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Ledger to View Accounts
                </h3>
                <p className="text-gray-600">
                  Choose a ledger from the list to view and manage its accounts.
                </p>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleGoToLedgers} 
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  Browse Ledgers
                </Button>
                
                <div className="text-sm text-gray-500">
                  <p>Or navigate directly to a ledger:</p>
                  <div className="mt-2 space-y-2">
                    <Button 
                      onClick={() => handleLedgerSelect({ name: 'default' } as V2Ledger)}
                      variant="secondary"
                      size="sm"
                    >
                      /accounts/default
                    </Button>
                    <Button 
                      onClick={() => handleLedgerSelect({ name: 'main' } as V2Ledger)}
                      variant="secondary"
                      size="sm"
                    >
                      /accounts/main
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {currentView === 'accounts' && selectedLedger && (
          <AccountList
            ledgerName={selectedLedger.name}
            onAccountSelect={handleAccountSelect}
            onBackToLedgers={handleBackToLedgers}
          />
        )}
        
        {currentView === 'account-details' && selectedLedger && selectedAccount && (
          <AccountDetails
            ledgerName={selectedLedger.name}
            accountAddress={selectedAccount.address}
            onBack={handleBackToAccounts}
          />
        )}
      </div>
    </Layout>
  );
};

export default AccountsPage; 