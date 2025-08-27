import React from 'react';
import Card from './Card';

const LedgerArchitecture: React.FC = () => {
  return (
    <Card title="📚 Ledger Architecture Overview">
      <div className="space-y-6">
        
        {/* Ledger Level */}
        <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
          <h3 className="text-lg font-bold text-blue-900 mb-3">🏦 Ledger: "ACH-Incoming"</h3>
          <p className="text-blue-700 mb-4">
            This is the top-level container that holds all accounts and transactions.
          </p>
          
          {/* Accounts Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="border border-green-200 rounded p-3 bg-green-50">
              <h4 className="font-semibold text-green-900">👤 Account: users:001</h4>
              <div className="text-sm text-green-700">
                <div>USD: $1,000</div>
                <div>EUR: €500</div>
              </div>
            </div>
            
            <div className="border border-green-200 rounded p-3 bg-green-50">
              <h4 className="font-semibold text-green-900">🏦 Account: bank:main</h4>
              <div className="text-sm text-green-700">
                <div>USD: $5,000</div>
                <div>EUR: €2,000</div>
              </div>
            </div>
            
            <div className="border border-green-200 rounded p-3 bg-green-50">
              <h4 className="font-semibold text-green-900">🏪 Account: merchants:store</h4>
              <div className="text-sm text-green-700">
                <div>USD: $500</div>
                <div>EUR: €200</div>
              </div>
            </div>
          </div>
          
          {/* Transactions Section */}
          <div className="border border-purple-200 rounded p-3 bg-purple-50">
            <h4 className="font-semibold text-purple-900 mb-2">💸 Transactions (Money Movements)</h4>
            <div className="space-y-2 text-sm text-purple-700">
              <div className="flex items-center">
                <span className="font-mono">TXN-001:</span>
                <span className="ml-2">@world → users:001: $1,000 USD</span>
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Account Created</span>
              </div>
              <div className="flex items-center">
                <span className="font-mono">TXN-002:</span>
                <span className="ml-2">users:001 → bank:main: $500 USD</span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Transfer</span>
              </div>
              <div className="flex items-center">
                <span className="font-mono">TXN-003:</span>
                <span className="ml-2">users:001 → merchants:store: $50 USD</span>
                <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">🏦 Ledger</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Top-level container</li>
              <li>• Isolated from other ledgers</li>
              <li>• Contains accounts & transactions</li>
              <li>• Example: "ACH-Incoming"</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">👤 Accounts</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Hold balances in assets</li>
              <li>• Created by transactions</li>
              <li>• Named with patterns</li>
              <li>• Example: "users:001"</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">💸 Transactions</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Move money between accounts</li>
              <li>• Create/update balances</li>
              <li>• Always have source & destination</li>
              <li>• Example: "Transfer $100"</li>
            </ul>
          </div>
        </div>

        {/* Real-World Analogy */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">🎯 Real-World Analogy</h4>
          <div className="text-sm text-yellow-800 space-y-2">
            <p><strong>Ledger = Bank</strong></p>
            <p><strong>Accounts = Customer Accounts</strong> (checking, savings, business)</p>
            <p><strong>Transactions = Money Movements</strong> (deposits, transfers, payments)</p>
            <p><strong>Assets = Currencies</strong> (USD, EUR, etc.)</p>
          </div>
        </div>

        {/* API Structure */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">🔗 API Structure</h4>
          <div className="text-sm text-gray-700 space-y-1 font-mono">
            <div>GET /v2/{'{ledger}'}/accounts</div>
            <div>GET /v2/{'{ledger}'}/transactions</div>
            <div>POST /v2/{'{ledger}'}/transactions</div>
            <div>GET /v2/{'{ledger}'}/accounts/{'{address}'}</div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Notice: All endpoints are under a specific ledger
          </p>
        </div>

      </div>
    </Card>
  );
};

export default LedgerArchitecture; 