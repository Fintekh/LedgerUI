import React, { useState } from 'react';

interface JsonViewerProps {
  data: any;
  level?: number;
  isCollapsed?: boolean;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, level = 0, isCollapsed = false }) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  const isObject = typeof data === 'object' && data !== null && !Array.isArray(data);
  const isArray = Array.isArray(data);
  const isPrimitive = !isObject && !isArray;

  const getValueColor = (value: any) => {
    if (typeof value === 'string') return 'text-green-600';
    if (typeof value === 'number') return 'text-blue-600';
    if (typeof value === 'boolean') return 'text-purple-600';
    if (value === null) return 'text-gray-500';
    return 'text-gray-900';
  };

  const getValueDisplay = (value: any) => {
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null) return 'null';
    return String(value);
  };

  const getKeyDisplay = (key: string) => {
    // Special formatting for common Formance Ledger keys
    const keyMap: { [key: string]: string } = {
      'transaction': 'Transaction Details',
      'postings': 'Postings',
      'metadata': 'Metadata',
      'reference': 'Reference',
      'timestamp': 'Timestamp',
      'id': 'Transaction ID',
      'insertedAt': 'Created At',
      'updatedAt': 'Updated At',
      'postCommitVolumes': 'Post-Commit Volumes',
      'amount': 'Amount',
      'asset': 'Asset',
      'source': 'Source Account',
      'destination': 'Destination Account',
      'account': 'Account',
      'balance': 'Balance',
      'input': 'Input',
      'output': 'Output',
      'net': 'Net',
    };
    
    return keyMap[key] || key;
  };

  const getKeyColor = (key: string) => {
    // Color coding for different types of keys
    if (['transaction', 'postings', 'metadata'].includes(key)) return 'text-purple-600';
    if (['amount', 'balance', 'input', 'output', 'net'].includes(key)) return 'text-blue-600';
    if (['source', 'destination', 'account'].includes(key)) return 'text-green-600';
    if (['reference', 'id', 'timestamp'].includes(key)) return 'text-orange-600';
    return 'text-blue-600';
  };

  if (isPrimitive) {
    return (
      <span className={`font-mono ${getValueColor(data)}`}>
        {getValueDisplay(data)}
      </span>
    );
  }

  if (isArray) {
    if (collapsed) {
      return (
        <div className="flex items-center">
          <button
            onClick={() => setCollapsed(false)}
            className="text-gray-400 hover:text-gray-600 mr-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="flex items-center mb-1">
          <button
            onClick={() => setCollapsed(true)}
            className="text-gray-400 hover:text-gray-600 mr-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div style={{ marginLeft: '16px' }}>
          {data.map((item: any, index: number) => (
            <div key={index} className="mb-1">
              <span className="text-gray-500 text-sm mr-1">[{index}]:</span>
              <JsonViewer data={item} level={level + 1} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isObject) {
    const keys = Object.keys(data);
    
    if (collapsed) {
      return (
        <div className="flex items-center">
          <button
            onClick={() => setCollapsed(false)}
            className="text-gray-400 hover:text-gray-600 mr-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      );
    }

    return (
      <div>
        <div style={{ marginLeft: '16px' }} className="space-y-0">
          {keys.map((key) => {
            const value = data[key];
            const isValuePrimitive = typeof value !== 'object' || value === null || Array.isArray(value);
            
            return (
              <div key={key} className="flex flex-col">
                {isValuePrimitive ? (
                  // Show key and primitive value on same line
                  <div className="flex items-start min-w-0">
                    <span className={`font-medium mr-1 flex-shrink-0 ${getKeyColor(key)}`}>
                      {getKeyDisplay(key)}:
                    </span>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <JsonViewer data={value} level={level + 1} />
                    </div>
                  </div>
                ) : (
                  // Show key and nested object/array on separate lines with proper indentation
                  <>
                    <div className="flex items-start min-w-0">
                      <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-gray-400 hover:text-gray-600 mr-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <span className={`font-medium mr-1 flex-shrink-0 ${getKeyColor(key)}`}>
                        {getKeyDisplay(key)}:
                      </span>
                    </div>
                    <div style={{ marginLeft: '16px' }} className="mt-0">
                      <JsonViewer data={value} level={level + 1} />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default JsonViewer; 