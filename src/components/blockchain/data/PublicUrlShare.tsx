import { useState } from 'react';
import { generatePublicUrl, copyToClipboard } from '../../../utils/blockchain-helpers';
import { getCardClasses, getButtonClasses } from '../../../utils/theme-utils';
import type { ComponentProps } from '../../../types/blockchain';

interface PublicUrlShareProps extends ComponentProps {
  storeAddress: string;
  chainId: number;
}

export const PublicUrlShare = ({ 
  storeAddress, 
  chainId,
  theme = 'dark' 
}: PublicUrlShareProps) => {
  const [copied, setCopied] = useState(false);
  const publicUrl = generatePublicUrl(storeAddress, chainId);

  const handleCopyUrl = async () => {
    const success = await copyToClipboard(publicUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={getCardClasses(theme)}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
        Public View URL
      </h3>
      
      <div className="space-y-3">
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Share this URL to give others public access to view this store's data:
        </p>
        
        <div className={`p-3 rounded-lg border ${
          theme === 'dark' 
            ? 'bg-gray-700/50 border-gray-600' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono break-all pr-2">
              {publicUrl}
            </span>
            
            <button
              onClick={handleCopyUrl}
              className={`${getButtonClasses(theme, 'secondary')} px-2 py-1 text-xs flex-shrink-0`}
              title="Copy URL"
            >
              {copied ? (
                <>
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${
          theme === 'dark' ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center text-green-400 mb-1">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Public Access</span>
          </div>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-green-300' : 'text-green-700'
          }`}>
            Anyone with this URL can view the store's sensor data, field configuration, 
            and historical records without needing to connect a wallet.
          </p>
        </div>
        
        {/* QR Code placeholder - could be implemented with a QR code library */}
        <div className="text-center">
          <button 
            className={`${getButtonClasses(theme, 'ghost')} text-sm`}
            onClick={() => {
              // Could implement QR code generation here
              alert('QR code generation would be implemented here');
            }}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Generate QR Code
          </button>
        </div>
      </div>
    </div>
  );
};