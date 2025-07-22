import { useState, useEffect } from 'react';
import { getCardClasses, getButtonClasses, getTabClasses } from '../../../utils/theme-utils';
import { formatValue, getTimeAgo, exportToCSV } from '../../../utils/blockchain-helpers';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { ErrorDisplay } from '../ui/ErrorDisplay';
import type { SensorDataProps, SensorRecord, ExportData } from '../../../types/blockchain';

export const SensorDataViews = ({ 
  storeAddress,
  fields,
  publicClient,
  theme = 'dark',
  loading = false,
  error,
  currentBlock
}: SensorDataProps) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('table');
  const [historicalData, setHistoricalData] = useState<SensorRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const pageSize = 20;

  const fetchHistoricalData = async () => {
    if (!publicClient || !storeAddress) return;
    
    setDataLoading(true);
    setDataError(null);
    
    try {
      // This would be the actual blockchain event fetching logic
      // For now, using placeholder data
      const mockData: SensorRecord[] = [
        {
          sensor: '0x1234567890123456789012345678901234567890',
          timestamp: Date.now() / 1000 - 3600,
          values: [2150, 750, 290],
          block: '12345',
          txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
        },
        {
          sensor: '0x1234567890123456789012345678901234567890',
          timestamp: Date.now() / 1000 - 7200,
          values: [2100, 740, 285],
          block: '12344',
          txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567891'
        }
      ];
      
      setHistoricalData(mockData);
      setLastUpdate(new Date());
    } catch (err) {
      setDataError(err instanceof Error ? err.message : 'Failed to fetch historical data');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [storeAddress, publicClient]);

  const handleExport = () => {
    const exportData: ExportData[] = historicalData.map((record, index) => {
      const baseData: ExportData = {
        timestamp: new Date(record.timestamp * 1000).toISOString(),
        sensor: record.sensor,
        block: record.block,
        txHash: record.txHash,
      };
      
      // Add field values
      fields.forEach((field, fieldIndex) => {
        if (record.values[fieldIndex] !== undefined) {
          baseData[field.name] = formatValue(record.values[fieldIndex], field.unit);
        }
      });
      
      return baseData;
    });
    
    exportToCSV(exportData, `sensor_data_${storeAddress.slice(0, 8)}.csv`);
  };

  const paginatedData = historicalData.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(historicalData.length / pageSize);

  if (loading) {
    return (
      <div className={getCardClasses(theme)}>
        <h3 className="text-lg font-semibold mb-4">Sensor Data</h3>
        <LoadingSkeleton lines={5} />
      </div>
    );
  }

  if (error || dataError) {
    return (
      <div className={getCardClasses(theme)}>
        <h3 className="text-lg font-semibold mb-4">Sensor Data</h3>
        <ErrorDisplay 
          error={error || dataError!} 
          onRetry={fetchHistoricalData}
        />
      </div>
    );
  }

  return (
    <div className={getCardClasses(theme)}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Latest Sensor Data</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
            {currentBlock && (
              <div className="flex items-center space-x-1">
                <span>Block:</span>
                <span className="text-purple-400 font-mono">{currentBlock.toString()}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <span>Updated:</span>
              <span className="text-gray-300">{lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={getTabClasses(theme, viewMode === 'table')}
            >
              📊 Table
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={getTabClasses(theme, viewMode === 'chart')}
            >
              📈 Chart
            </button>
          </div>
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={historicalData.length === 0}
            className={getButtonClasses(theme, 'secondary')}
          >
            📥 Export CSV
          </button>
        </div>
      </div>
      
      {dataLoading && (
        <LoadingSkeleton lines={3} className="mb-4" />
      )}
      
      {viewMode === 'table' && !dataLoading && (
        <div className="space-y-4">
          {/* Table View */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Timestamp
                  </th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Sensor
                  </th>
                  {fields.map((field) => (
                    <th 
                      key={field.name}
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {field.name} ({field.unit})
                    </th>
                  ))}
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Block
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((record, index) => (
                  <tr 
                    key={`${record.block}-${index}`}
                    className={`${
                      theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <div>{new Date(record.timestamp * 1000).toLocaleString()}</div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {getTimeAgo(record.timestamp)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {record.sensor.slice(0, 8)}...
                    </td>
                    {fields.map((field, fieldIndex) => (
                      <td key={field.name} className="px-4 py-3 text-sm">
                        {record.values[fieldIndex] !== undefined 
                          ? formatValue(record.values[fieldIndex], field.unit)
                          : 'N/A'
                        }
                      </td>
                    ))}
                    <td className="px-4 py-3 text-sm font-mono">
                      #{record.block}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, historicalData.length)} of {historicalData.length} records
              </p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className={getButtonClasses(theme, 'secondary')}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className={getButtonClasses(theme, 'secondary')}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {viewMode === 'chart' && !dataLoading && (
        <div className="text-center py-8">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Chart visualization will be implemented with Chart.js integration
          </p>
        </div>
      )}
      
      {!dataLoading && historicalData.length === 0 && (
        <div className="text-center py-8">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            No sensor data found for this store.
          </p>
        </div>
      )}
    </div>
  );
};