import { faker } from '@faker-js/faker';
import { V2PostTransaction, V2Posting, V2Metadata } from '../types/transaction';
import { V2Metadata as AccountMetadata } from '../types/ledger';

// Banking partner configurations
interface BankingPartner {
  name: string;
  code: string;
  ledgers: string[];
  customerTypes: string[];
  paymentMethods: string[];
}

// Sample data configuration
interface SampleDataConfig {
  bankingPartners: number;
  ledgersPerPartner: number;
  accountsPerLedger: number;
  transactionsPerLedger: number;
}

// Banking partners with realistic names and configurations
const BANKING_PARTNERS: BankingPartner[] = [
  {
    name: 'Meridian Financial Group',
    code: 'MERIDIAN',
    ledgers: ['Meridian-Payments', 'Meridian-Transfers', 'Meridian-Services', 'Meridian-Operations'],
    customerTypes: ['retail', 'business', 'enterprise'],
    paymentMethods: ['ACH', 'RTP', 'Wire', 'FedNow']
  },
  {
    name: 'Summit National Bank',
    code: 'SUMMIT',
    ledgers: ['Summit-Payments', 'Summit-Transfers', 'Summit-Services', 'Summit-Operations'],
    customerTypes: ['retail', 'business', 'corporate'],
    paymentMethods: ['ACH', 'RTP', 'Wire', 'FedNow']
  },
  {
    name: 'Horizon Trust & Savings',
    code: 'HORIZON',
    ledgers: ['Horizon-Payments', 'Horizon-Transfers', 'Horizon-Services', 'Horizon-Operations'],
    customerTypes: ['retail', 'business', 'commercial'],
    paymentMethods: ['ACH', 'RTP', 'Wire', 'FedNow']
  },
  {
    name: 'Pinnacle Community Bank',
    code: 'PINNACLE',
    ledgers: ['Pinnacle-Payments', 'Pinnacle-Transfers', 'Pinnacle-Services', 'Pinnacle-Operations'],
    customerTypes: ['retail', 'business', 'institutional'],
    paymentMethods: ['ACH', 'RTP', 'Wire', 'FedNow']
  },
  {
    name: 'Aurora Regional Bank',
    code: 'AURORA',
    ledgers: ['Aurora-Payments', 'Aurora-Transfers', 'Aurora-Services', 'Aurora-Operations'],
    customerTypes: ['retail', 'business', 'corporate'],
    paymentMethods: ['ACH', 'RTP', 'Wire', 'FedNow']
  }
];

// Helper function to generate unique ledger names
function generateUniqueLedgerName(baseName: string): string {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.random().toString(36).substring(2, 5); // 3 random chars
  return `${baseName}-${timestamp}-${random}`;
}

// Payment method configurations
const PAYMENT_METHODS = {
  ACH: {
    minAmount: 1000, // $10.00 in cents
    maxAmount: 50000, // $500.00 in cents
    description: 'Automated Clearing House'
  },
  RTP: {
    minAmount: 100, // $1.00 in cents
    maxAmount: 250000, // $2,500.00 in cents
    description: 'Real-Time Payments'
  },
  Wire: {
    minAmount: 10000, // $100.00 in cents
    maxAmount: 1000000, // $10,000.00 in cents
    description: 'Wire Transfer'
  },
  FedNow: {
    minAmount: 100, // $1.00 in cents
    maxAmount: 100000, // $1,000.00 in cents
    description: 'FedNow Instant Payments'
  }
};

// Asset types for different payment methods
const ASSETS = {
  ACH: ['USD'],
  RTP: ['USD'],
  Wire: ['USD', 'EUR', 'GBP'],
  FedNow: ['USD']
};

// Generate realistic account names based on type and partner
function generateAccountName(partner: BankingPartner, customerType: string, paymentMethod: string, index: number): string {
  const partnerCode = partner.code.toLowerCase();
  
  // Generate fictional business names based on customer type
  const getBusinessName = (type: string, index: number): string => {
    const businessNames = {
      retail: [
        'TechCorp Solutions', 'Global Retail Inc', 'Digital Commerce Co', 'E-Commerce Partners',
        'Online Marketplace', 'Retail Innovations', 'Consumer Goods Co', 'Digital Retail Group',
        'Modern Commerce', 'Retail Dynamics', 'Consumer Solutions', 'Digital Storefront',
        'Retail Technologies', 'Consumer Services', 'Digital Retailers'
      ],
      business: [
        'Innovation Labs', 'Strategic Partners', 'Business Solutions Inc', 'Corporate Services',
        'Enterprise Solutions', 'Business Technologies', 'Strategic Consulting', 'Corporate Partners',
        'Business Innovations', 'Strategic Services', 'Enterprise Partners', 'Business Dynamics',
        'Corporate Solutions', 'Strategic Technologies', 'Business Partners'
      ],
      enterprise: [
        'Global Enterprises', 'International Corp', 'Enterprise Solutions', 'Corporate Holdings',
        'Strategic Enterprises', 'Global Partners', 'Enterprise Technologies', 'International Services',
        'Corporate Enterprises', 'Global Solutions', 'Enterprise Partners', 'Strategic Holdings',
        'International Partners', 'Global Technologies', 'Enterprise Dynamics'
      ],
      corporate: [
        'Corporate Holdings', 'Strategic Corp', 'Global Enterprises', 'International Partners',
        'Enterprise Corp', 'Corporate Solutions', 'Strategic Enterprises', 'Global Holdings',
        'International Corp', 'Enterprise Partners', 'Corporate Technologies', 'Strategic Solutions',
        'Global Corp', 'Enterprise Holdings', 'Corporate Partners'
      ],
      commercial: [
        'Commercial Solutions', 'Business Partners', 'Corporate Services', 'Strategic Commercial',
        'Enterprise Commercial', 'Commercial Technologies', 'Business Solutions', 'Corporate Partners',
        'Strategic Services', 'Commercial Enterprises', 'Business Technologies', 'Corporate Solutions',
        'Enterprise Partners', 'Commercial Holdings', 'Strategic Commercial'
      ],
      institutional: [
        'Institutional Partners', 'Strategic Institutions', 'Corporate Holdings', 'Global Institutions',
        'Enterprise Institutions', 'Institutional Solutions', 'Strategic Partners', 'Corporate Institutions',
        'Global Partners', 'Institutional Technologies', 'Enterprise Partners', 'Strategic Holdings',
        'Corporate Institutions', 'Global Solutions', 'Institutional Enterprises'
      ]
    };
    
    const names = businessNames[type as keyof typeof businessNames] || businessNames.business;
    return names[index % names.length].toLowerCase().replace(/[^a-z0-9]/g, '');
  };
  
  const businessName = getBusinessName(customerType, index);
  const accountId = String(index + 1).padStart(4, '0');
  
  return `${partnerCode}:${businessName}:${paymentMethod.toLowerCase()}:${accountId}`;
}

// Generate suspense account name
function generateSuspenseAccount(partner: BankingPartner, paymentMethod: string): string {
  const suspenseNames = {
    ACH: 'failed-ach-payments',
    RTP: 'failed-rtp-payments', 
    Wire: 'failed-wire-payments',
    FedNow: 'failed-fednow-payments'
  };
  
  const suspenseName = suspenseNames[paymentMethod as keyof typeof suspenseNames] || 'failed-payments';
  return `${partner.code.toLowerCase()}:suspense:${suspenseName}`;
}

// Generate realistic transaction amounts based on payment method
function generateTransactionAmount(paymentMethod: string): number {
  const config = PAYMENT_METHODS[paymentMethod as keyof typeof PAYMENT_METHODS];
  const min = config.minAmount;
  const max = config.maxAmount;
  
  // Generate amounts with realistic distribution
  const baseAmount = faker.number.float({ min, max, fractionDigits: 2 });
  
  // Add some common payment amounts
  const commonAmounts = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
  if (faker.number.int({ min: 1, max: 10 }) <= 3) {
    return commonAmounts[faker.number.int({ min: 0, max: commonAmounts.length - 1 })];
  }
  
  // Convert to integer (cents) - Formance Ledger expects integer amounts
  return Math.round(baseAmount * 100);
}

// Generate realistic transaction metadata
function generateTransactionMetadata(paymentMethod: string, partner: BankingPartner): V2Metadata {
  const metadata: V2Metadata = {
    payment_method: paymentMethod,
    bank_partner: partner.name,
    transaction_type: faker.helpers.arrayElement(['incoming', 'outgoing', 'transfer']),
    reference_id: faker.string.alphanumeric(12).toUpperCase(),
    timestamp: new Date().toISOString(),
    business_category: faker.helpers.arrayElement([
      'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 
      'Education', 'Real Estate', 'Transportation', 'Energy', 'Entertainment'
    ]),
    transaction_purpose: faker.helpers.arrayElement([
      'Payment for Services', 'Product Purchase', 'Subscription Payment',
      'Salary Payment', 'Vendor Payment', 'Client Payment', 'Refund',
      'Investment Transfer', 'Loan Payment', 'Insurance Premium'
    ])
  };

  // Add payment method specific metadata
  switch (paymentMethod) {
    case 'ACH':
      metadata.ach_type = faker.helpers.arrayElement(['credit', 'debit']);
      metadata.routing_number = faker.string.numeric(9);
      metadata.account_type = faker.helpers.arrayElement(['checking', 'savings']);
      break;
    case 'RTP':
      metadata.rtp_id = faker.string.alphanumeric(16).toUpperCase();
      metadata.request_id = faker.string.uuid();
      metadata.settlement_type = faker.helpers.arrayElement(['instant', 'scheduled']);
      break;
    case 'Wire':
      metadata.swift_code = faker.string.alpha(4).toUpperCase() + faker.string.alpha(2).toUpperCase() + faker.string.alphanumeric(2).toUpperCase();
      metadata.wire_type = faker.helpers.arrayElement(['domestic', 'international']);
      metadata.currency = faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'CAD', 'AUD']);
      break;
    case 'FedNow':
      metadata.fednow_id = faker.string.alphanumeric(20).toUpperCase();
      metadata.request_id = faker.string.uuid();
      metadata.service_type = faker.helpers.arrayElement(['credit', 'debit', 'request']);
      break;
  }

  // Ensure all values are strings
  const stringMetadata: V2Metadata = {};
  for (const [key, value] of Object.entries(metadata)) {
    stringMetadata[key] = String(value);
  }

  return stringMetadata;
}

// Generate account metadata
function generateAccountMetadata(customerType: string, partner: BankingPartner, paymentMethod: string): AccountMetadata {
  return {
    customer_type: customerType,
    bank_partner: partner.name,
    payment_method: paymentMethod,
    account_status: faker.helpers.arrayElement(['active', 'active', 'active', 'suspended', 'pending']),
    created_date: faker.date.past().toISOString(),
    last_activity: faker.date.recent().toISOString(),
    balance_limit: faker.number.int({ min: 10000, max: 1000000 }).toString(),
    kyc_status: faker.helpers.arrayElement(['verified', 'pending', 'verified', 'verified']),
    risk_level: faker.helpers.arrayElement(['low', 'medium', 'high', 'low', 'medium']),
    business_industry: faker.helpers.arrayElement([
      'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing',
      'Education', 'Real Estate', 'Transportation', 'Energy', 'Entertainment'
    ]),
    account_type: faker.helpers.arrayElement(['checking', 'savings', 'business', 'corporate']),
    monthly_volume: faker.number.int({ min: 10000, max: 1000000 }).toString(),
    transaction_frequency: faker.helpers.arrayElement(['low', 'medium', 'high']),
    compliance_status: faker.helpers.arrayElement(['compliant', 'pending_review', 'compliant', 'compliant'])
  };
}

// Generate sample data for a single ledger
export async function generateLedgerSampleData(
  ledgerName: string,
  partner: BankingPartner,
  config: SampleDataConfig
): Promise<{
  ledgerName: string;
  accounts: Array<{ address: string; metadata: AccountMetadata }>;
  transactions: V2PostTransaction[];
}> {
  // Generate unique ledger name to avoid conflicts
  const uniqueLedgerName = generateUniqueLedgerName(ledgerName);
  
  const accounts: Array<{ address: string; metadata: AccountMetadata }> = [];
  const transactions: V2PostTransaction[] = [];

  // Generate accounts for each customer type and payment method
  for (const customerType of partner.customerTypes.slice(0, Math.ceil(config.accountsPerLedger / partner.paymentMethods.length))) {
    for (const paymentMethod of partner.paymentMethods) {
      const accountCount = Math.ceil(config.accountsPerLedger / (partner.customerTypes.length * partner.paymentMethods.length));
      
      for (let i = 0; i < accountCount; i++) {
        const accountName = generateAccountName(partner, customerType, paymentMethod, i);
        const accountMetadata = generateAccountMetadata(customerType, partner, paymentMethod);
        
        accounts.push({
          address: accountName,
          metadata: accountMetadata
        });
      }
    }
  }

  // Generate suspense account for failed payments
  for (const paymentMethod of partner.paymentMethods) {
    const suspenseAccount = generateSuspenseAccount(partner, paymentMethod);
    accounts.push({
      address: suspenseAccount,
      metadata: {
        type: 'suspense',
        purpose: 'failed_payments',
        payment_method: paymentMethod,
        partner_code: partner.code.toLowerCase()
      }
    });
  }

  // Generate transactions
  const transactionCount = config.transactionsPerLedger;
  for (let i = 0; i < transactionCount; i++) {
    const paymentMethod = faker.helpers.arrayElement(partner.paymentMethods);
    const amount = generateTransactionAmount(paymentMethod);
    const asset = faker.helpers.arrayElement(ASSETS[paymentMethod as keyof typeof ASSETS]);
    const metadata = generateTransactionMetadata(paymentMethod, partner);
    
    // For now, create simple transactions from world to random accounts
    // This avoids issues with accounts not existing yet
    const destinationAccount = faker.helpers.arrayElement(accounts).address;
    
    const posting: V2Posting = {
      source: 'world',
      destination: destinationAccount,
      amount: amount,
      asset: asset
    };

    // 10% chance of failed transaction (goes to suspense)
    const isFailed = Math.random() < 0.1;
    if (isFailed) {
      const suspenseAccount = generateSuspenseAccount(partner, paymentMethod);
      const failedPosting: V2Posting = {
        source: 'world',
        destination: suspenseAccount,
        amount: amount,
        asset: asset
      };
      
      transactions.push({
        postings: [failedPosting],
        metadata: {
          ...metadata,
          status: 'failed',
          failure_reason: faker.helpers.arrayElement([
            'insufficient_funds',
            'account_not_found',
            'routing_error',
            'account_closed',
            'fraud_alert'
          ])
        },
        reference: `FAILED-${faker.string.alphanumeric(8).toUpperCase()}`,
        timestamp: faker.date.recent().toISOString()
      });
    } else {
      // Successful transaction
      transactions.push({
        postings: [posting],
        metadata: {
          ...metadata,
          status: 'completed'
        },
        reference: `TXN-${faker.string.alphanumeric(8).toUpperCase()}`,
        timestamp: faker.date.recent().toISOString()
      });
    }
  }

  // Add a simple test transaction for debugging
  transactions.push({
    postings: [{
      source: 'world',
      destination: 'test-account',
      amount: 10000, // $100.00 in cents
      asset: 'USD'
    }],
    metadata: {
      test: 'value',
      debug: 'true'
    },
    reference: 'DEBUG-TEST',
    timestamp: new Date().toISOString()
  });

  return { ledgerName: uniqueLedgerName, accounts, transactions };
}

// Generate complete sample data for all partners
export async function generateCompleteSampleData(config: SampleDataConfig): Promise<{
  ledgers: string[];
  totalAccounts: number;
  totalTransactions: number;
  data: Array<{
    ledgerName: string;
    accounts: Array<{ address: string; metadata: AccountMetadata }>;
    transactions: V2PostTransaction[];
  }>;
}> {
  const ledgers: string[] = [];
  let totalAccounts = 0;
  let totalTransactions = 0;
  const data: Array<{
    ledgerName: string;
    accounts: Array<{ address: string; metadata: AccountMetadata }>;
    transactions: V2PostTransaction[];
  }> = [];

  // Generate data for each banking partner
  for (const partner of BANKING_PARTNERS.slice(0, config.bankingPartners)) {
    for (const ledgerName of partner.ledgers.slice(0, config.ledgersPerPartner)) {
      const ledgerData = await generateLedgerSampleData(ledgerName, partner, config);
      
      ledgers.push(ledgerData.ledgerName);
      totalAccounts += ledgerData.accounts.length;
      totalTransactions += ledgerData.transactions.length;
      data.push(ledgerData);
    }
  }

  return { ledgers, totalAccounts, totalTransactions, data };
}

// Default configuration
export const DEFAULT_SAMPLE_CONFIG: SampleDataConfig = {
  bankingPartners: 3,
  ledgersPerPartner: 2,
  accountsPerLedger: 10,
  transactionsPerLedger: 25
};

// Configuration presets
export const SAMPLE_CONFIG_PRESETS = {
  small: {
    bankingPartners: 2,
    ledgersPerPartner: 1,
    accountsPerLedger: 5,
    transactionsPerLedger: 10
  },
  medium: {
    bankingPartners: 3,
    ledgersPerPartner: 2,
    accountsPerLedger: 10,
    transactionsPerLedger: 25
  },
  large: {
    bankingPartners: 5,
    ledgersPerPartner: 4,
    accountsPerLedger: 20,
    transactionsPerLedger: 50
  }
}; 