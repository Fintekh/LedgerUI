import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import LedgerPage from './pages/LedgerPage';
import AccountsPage from './pages/AccountsPage';
import TransactionsPage from './pages/TransactionsPage';
import BalancesPage from './pages/BalancesPage';
import VolumesPage from './pages/VolumesPage';
import LogsPage from './pages/LogsPage';
import SettingsPage from './pages/SettingsPage';
import './assets/styles/index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ledgers" element={<LedgerPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/:ledgerName" element={<AccountsPage />} />
          <Route path="/accounts/:ledgerName/:accountAddress" element={<AccountsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/:ledgerName" element={<TransactionsPage />} />
          <Route path="/transactions/:ledgerName/:transactionId" element={<TransactionsPage />} />
          <Route path="/balances" element={<BalancesPage />} />
          <Route path="/balances/:ledgerName" element={<BalancesPage />} />
          <Route path="/volumes" element={<VolumesPage />} />
          <Route path="/volumes/:ledgerName" element={<VolumesPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/logs/:ledgerName" element={<LogsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;