import React, { useState } from 'react';
import { useCreateSampleData } from '../services/api/sampleData';
import { SAMPLE_CONFIG_PRESETS, SampleDataConfig } from '../services/sampleDataGenerator';
import Layout from '../components/common/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const SettingsPage: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<'small' | 'medium' | 'large'>('medium');
  const [customConfig, setCustomConfig] = useState<SampleDataConfig>(SAMPLE_CONFIG_PRESETS.medium);
  const [showCustomConfig, setShowCustomConfig] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{
    isGenerating: boolean;
    progress: string;
    results?: any;
  }>({
    isGenerating: false,
    progress: ''
  });

  const createSampleDataMutation = useCreateSampleData();

  const handlePresetChange = (preset: 'small' | 'medium' | 'large') => {
    setSelectedPreset(preset);
    setCustomConfig(SAMPLE_CONFIG_PRESETS[preset]);
    setShowCustomConfig(false);
  };

  const handleCustomConfigChange = (field: keyof SampleDataConfig, value: number) => {
    setCustomConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateSampleData = async () => {
    const config = showCustomConfig ? customConfig : SAMPLE_CONFIG_PRESETS[selectedPreset];
    
    setGenerationProgress({
      isGenerating: true,
      progress: 'Starting sample data generation...'
    });

    try {
      const results = await createSampleDataMutation.mutateAsync(config);
      
      setGenerationProgress({
        isGenerating: false,
        progress: 'Sample data generation completed!',
        results
      });
    } catch (error) {
      setGenerationProgress({
        isGenerating: false,
        progress: `Error generating sample data: ${error}`,
        results: null
      });
    }
  };

  const calculateTotalItems = (config: SampleDataConfig) => {
    const totalLedgers = config.bankingPartners * config.ledgersPerPartner;
    const totalAccounts = totalLedgers * config.accountsPerLedger;
    const totalTransactions = totalLedgers * config.transactionsPerLedger;
    
    return {
      ledgers: totalLedgers,
      accounts: totalAccounts,
      transactions: totalTransactions,
      total: totalLedgers + totalAccounts + totalTransactions
    };
  };

  const currentConfig = showCustomConfig ? customConfig : SAMPLE_CONFIG_PRESETS[selectedPreset];
  const totals = calculateTotalItems(currentConfig);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Settings & Sample Data
          </h1>
          <p className="text-lg text-gray-600">
            Generate realistic sample data for testing and demonstration
          </p>
        </div>

        {/* Sample Data Generation */}
        <Card title="🎯 Sample Data Generation">
          <div className="space-y-6">
            {/* Preset Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration Presets</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['small', 'medium', 'large'] as const).map((preset) => (
                  <div
                    key={preset}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPreset === preset && !showCustomConfig
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePresetChange(preset)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 capitalize">{preset}</h4>
                      {selectedPreset === preset && !showCustomConfig && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• {SAMPLE_CONFIG_PRESETS[preset].bankingPartners} Banking Partners</div>
                      <div>• {SAMPLE_CONFIG_PRESETS[preset].ledgersPerPartner} Ledgers per Partner</div>
                      <div>• {SAMPLE_CONFIG_PRESETS[preset].accountsPerLedger} Accounts per Ledger</div>
                      <div>• {SAMPLE_CONFIG_PRESETS[preset].transactionsPerLedger} Transactions per Ledger</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Configuration */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Custom Configuration</h3>
                <Button
                  onClick={() => setShowCustomConfig(!showCustomConfig)}
                  variant="secondary"
                  size="sm"
                >
                  {showCustomConfig ? 'Hide Custom' : 'Show Custom'}
                </Button>
              </div>

              {showCustomConfig && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banking Partners
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={customConfig.bankingPartners}
                      onChange={(e) => handleCustomConfigChange('bankingPartners', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ledgers per Partner
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="4"
                      value={customConfig.ledgersPerPartner}
                      onChange={(e) => handleCustomConfigChange('ledgersPerPartner', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Accounts per Ledger
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={customConfig.accountsPerLedger}
                      onChange={(e) => handleCustomConfigChange('accountsPerLedger', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transactions per Ledger
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={customConfig.transactionsPerLedger}
                      onChange={(e) => handleCustomConfigChange('transactionsPerLedger', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">📊 Generation Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Ledgers:</span>
                  <span className="ml-2 text-blue-600">{totals.ledgers}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Accounts:</span>
                  <span className="ml-2 text-blue-600">{totals.accounts}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Transactions:</span>
                  <span className="ml-2 text-blue-600">{totals.transactions}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Total Items:</span>
                  <span className="ml-2 text-blue-600">{totals.total}</span>
                </div>
              </div>
            </div>

            {/* Generation Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleGenerateSampleData}
                disabled={generationProgress.isGenerating}
                variant="primary"
                size="lg"
              >
                {generationProgress.isGenerating ? 'Generating...' : 'Generate Sample Data'}
              </Button>
            </div>

            {/* Progress and Results */}
            {generationProgress.progress && (
              <div className={`rounded-lg p-4 ${
                generationProgress.isGenerating 
                  ? 'bg-yellow-50 border border-yellow-200' 
                  : generationProgress.results 
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
              }`}>
                <h4 className={`font-medium mb-2 ${
                  generationProgress.isGenerating 
                    ? 'text-yellow-900' 
                    : generationProgress.results 
                      ? 'text-green-900'
                      : 'text-red-900'
                }`}>
                  {generationProgress.isGenerating ? '🔄 Generating...' : 
                   generationProgress.results ? '✅ Generation Complete' : '❌ Generation Failed'}
                </h4>
                <p className={`text-sm ${
                  generationProgress.isGenerating 
                    ? 'text-yellow-700' 
                    : generationProgress.results 
                      ? 'text-green-700'
                      : 'text-red-700'
                }`}>
                  {generationProgress.progress}
                </p>

                {generationProgress.results && (
                  <div className="mt-4 space-y-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-green-700">Created Ledgers:</span>
                        <span className="ml-2 text-green-600">{generationProgress.results.ledgers.length}</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Created Accounts:</span>
                        <span className="ml-2 text-green-600">{generationProgress.results.results.accounts.length}</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Created Transactions:</span>
                        <span className="ml-2 text-green-600">{generationProgress.results.results.transactions.length}</span>
                      </div>
                      <div>
                        <span className="font-medium text-green-700">Errors:</span>
                        <span className="ml-2 text-green-600">{generationProgress.results.results.errors.length}</span>
                      </div>
                    </div>

                    {generationProgress.results.results.errors.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-yellow-900 mb-2">⚠️ Errors:</h5>
                        <div className="bg-yellow-50 rounded p-3 max-h-32 overflow-y-auto">
                          {generationProgress.results.results.errors.map((error: string, index: number) => (
                            <div key={index} className="text-xs text-yellow-800 mb-1">
                              • {error}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Sample Data Description */}
        <Card title="📋 Sample Data Description">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🏦 Banking Partners</h4>
              <p className="text-sm text-gray-600">
                Realistic fictional banking partners including Meridian Financial Group, Summit National Bank, 
                Horizon Trust & Savings, Pinnacle Community Bank, and Aurora Regional Bank.
                Each partner has multiple ledgers for different payment processing types.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">💳 Payment Methods</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium text-gray-900">ACH</div>
                  <div className="text-gray-600">$1-$25,000</div>
                  <div className="text-gray-500">1-2 business days</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium text-gray-900">RTP</div>
                  <div className="text-gray-600">$1-$1,000,000</div>
                  <div className="text-gray-500">Real-time</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium text-gray-900">Wire</div>
                  <div className="text-gray-600">$100-$10,000,000</div>
                  <div className="text-gray-500">Same day</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium text-gray-900">FedNow</div>
                  <div className="text-gray-600">$1-$500,000</div>
                  <div className="text-gray-500">Real-time</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">👥 Customer Types</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-medium text-blue-900">Retail</div>
                  <div className="text-blue-600">Consumer businesses</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-medium text-green-900">Business</div>
                  <div className="text-green-600">Small & medium businesses</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="font-medium text-purple-900">Enterprise</div>
                  <div className="text-purple-600">Large corporations</div>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <div className="font-medium text-orange-900">Suspense</div>
                  <div className="text-orange-600">Failed payments</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">🔍 Account Naming Convention</h4>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <div className="font-mono text-gray-700">
                  {`{partner_code}:{business_name}:{payment_method}:{account_id}`}
                </div>
                <div className="text-gray-600 mt-1">
                  Example: meridian:techcorpsolutions:ach:0001
                </div>
                <div className="text-gray-500 mt-1 text-xs">
                  Business names are fictional and include companies like TechCorp Solutions, Innovation Labs, 
                  Global Enterprises, etc. based on customer type.
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage; 