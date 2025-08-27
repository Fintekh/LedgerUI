import React from 'react';
import { V2Log } from '../../types/ledger';
import { format } from 'date-fns';
import JsonViewer from '../common/JsonViewer';

interface LogDetailsProps {
  log: V2Log;
}

const LogDetails: React.FC<LogDetailsProps> = ({ log }) => {
  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'NEW_TRANSACTION':
        return 'bg-green-100 text-green-800';
      case 'SET_METADATA':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE_METADATA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (hasError: boolean) => {
    return hasError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Basic Information
        </h4>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Log ID:</span>
            <span className="font-mono text-gray-900 text-sm">#{log.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Type:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLogTypeColor(log.type)}`}>
              {log.type}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Date:</span>
            <span className="text-gray-900 text-sm">
              {format(new Date(log.date), 'MMM dd, yyyy HH:mm:ss')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(!!log.error)}`}>
              {log.error ? 'Error' : 'Success'}
            </span>
          </div>
        </div>
      </div>

      {/* Hash Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Hash
        </h4>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <code className="text-xs text-gray-700 break-all font-mono">
            {log.hash}
          </code>
        </div>
      </div>

      {/* Error Information (if applicable) */}
      {log.error && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Error Details
          </h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-sm text-red-800">
              <strong>Error:</strong> {log.error}
            </div>
          </div>
        </div>
      )}

      {/* Data Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Log Data
        </h4>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-hidden">
          <div className="text-sm break-words">
            <JsonViewer data={log.data} />
          </div>
        </div>
      </div>

      {/* Ledger Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Ledger Information
        </h4>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Ledger:</span>
            <span className="font-medium text-gray-900 text-sm">{log.ledger}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogDetails; 