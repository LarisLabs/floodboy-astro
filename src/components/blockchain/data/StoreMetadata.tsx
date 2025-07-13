import { formatBlockNumber, calculateBlockTime } from '../../../utils/blockchain-helpers';
import { getCardClasses } from '../../../utils/theme-utils';
import type { StoreData, ComponentProps } from '../../../types/blockchain';

interface StoreMetadataProps extends ComponentProps {
  storeData: StoreData;
  currentBlock?: bigint | null;
}

export const StoreMetadata = ({ 
  storeData, 
  currentBlock,
  theme = 'dark' 
}: StoreMetadataProps) => {
  return (
    <div className={getCardClasses(theme)}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Store Metadata
      </h3>
      
      <div className="space-y-4">
        {/* Fields Configuration */}
        <div>
          <h4 className={`text-sm font-medium mb-3 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Field Configuration ({storeData.fields.length} fields)
          </h4>
          
          <div className="space-y-2">
            {storeData.fields.map((field, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700/50 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div>
                  <span className="font-medium">{field.name}</span>
                  <span className={`ml-2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    ({field.dtype})
                  </span>
                </div>
                <span className={`text-sm px-2 py-1 rounded ${
                  theme === 'dark' 
                    ? 'bg-purple-900/30 text-purple-300' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {field.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Deployment Information */}
        {(storeData.deployedBlock || storeData.lastUpdatedBlock) && (
          <div>
            <h4 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Deployment Information
            </h4>
            
            <div className="space-y-2">
              {storeData.deployedBlock && (
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Deployed at Block
                  </span>
                  <div className="text-right">
                    <div className="font-mono text-sm">
                      #{formatBlockNumber(storeData.deployedBlock)}
                    </div>
                    {currentBlock && (
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {calculateBlockTime(storeData.deployedBlock, currentBlock)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {storeData.lastUpdatedBlock && (
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Last Updated
                  </span>
                  <div className="text-right">
                    <div className="font-mono text-sm">
                      #{formatBlockNumber(storeData.lastUpdatedBlock)}
                    </div>
                    {currentBlock && (
                      <div className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {calculateBlockTime(storeData.lastUpdatedBlock, currentBlock)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Authorized Sensors */}
        {storeData.authorizedSensors.length > 0 && (
          <div>
            <h4 className={`text-sm font-medium mb-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Authorized Sensors ({storeData.authorizedSensors.length})
            </h4>
            
            <div className="space-y-1">
              {storeData.authorizedSensors.map((sensor, index) => (
                <div 
                  key={sensor}
                  className={`p-2 rounded text-sm font-mono ${
                    theme === 'dark' 
                      ? 'bg-gray-700/30 text-gray-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {sensor}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Summary Stats */}
        <div className={`p-3 rounded-lg ${
          theme === 'dark' ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center text-blue-400 mb-2">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Store Summary</span>
          </div>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
          }`}>
            This store has {storeData.fields.length} configured sensor fields, 
            {storeData.authorizedSensors.length} authorized sensors, and 
            {storeData.totalRecords} total data records stored on-chain.
          </p>
        </div>
      </div>
    </div>
  );
};