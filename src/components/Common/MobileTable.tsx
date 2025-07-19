import React from 'react';
import { ChevronRight, Eye, Check, X, Clock, CheckCircle, XCircle } from 'lucide-react';

interface MobileTableProps {
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    mobilePriority?: boolean;
  }[];
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

const MobileTable: React.FC<MobileTableProps> = ({
  data,
  columns,
  onRowClick,
  emptyMessage = "No data found",
  loading = false,
  className = ""
}) => {
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg ${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-lg ${className}`}>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column) => (
                <th key={column.key} className="text-left p-4 font-medium text-gray-700">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={row._id || index} 
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="p-4">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-200">
          {data.map((row, index) => (
            <div 
              key={row._id || index}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onRowClick?.(row)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1 min-w-0">
                  {columns
                    .filter(col => col.mobilePriority !== false)
                    .slice(0, 2)
                    .map((column) => (
                      <div key={column.key} className="mb-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          {column.label}
                        </p>
                        <div className="flex items-center space-x-2">
                          {column.key === 'status' && getStatusIcon(row[column.key])}
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {column.render ? column.render(row[column.key], row) : row[column.key]}
                          </p>
                          {column.key === 'status' && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(row[column.key])}`}>
                              {row[column.key]}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>

              {/* Additional details in collapsible format */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {columns
                  .filter(col => col.mobilePriority !== false)
                  .slice(2)
                  .map((column) => (
                    <div key={column.key}>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                        {column.label}
                      </p>
                      <p className="text-gray-900 truncate">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </p>
                    </div>
                  ))}
              </div>

              {/* Action buttons for mobile */}
              {row.actions && (
                <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-100">
                  {row.actions}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileTable; 