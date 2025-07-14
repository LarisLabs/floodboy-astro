// Blockchain utility functions for formatting and data processing

export const formatAddress = (address: string): string => 
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export const formatValue = (value: string | bigint, unit: string): string => {
  const num = BigInt(value);
  
  // If unit contains "count", return the raw value as it's a counter
  if (unit.toLowerCase().includes('count')) {
    return num.toString();
  }
  
  // Check if unit contains scaling factor (e.g., "m x 1000", "V x 1000")
  if (unit.includes('x 1000')) {
    return (Number(num) / 1000).toFixed(2);
  }
  if (unit.includes('x 100')) {
    return (Number(num) / 100).toFixed(2);
  }
  if (unit.includes('x 10')) {
    return (Number(num) / 10).toFixed(1);
  }
  if (unit.includes('°C') || unit.includes('pH')) {
    return (Number(num) / 100).toFixed(2);
  }
  if (unit.includes('%')) {
    return (Number(num) / 10).toFixed(1);
  }
  return num.toString();
};

export const getTimeAgo = (timestamp: string | number): string => {
  const date = new Date(parseInt(timestamp.toString()) * 1000);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  
  return `${Math.floor(hours / 24)} days ago`;
};

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

export const generatePublicUrl = (storeAddress: string, chainId: number): string => {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?store=${storeAddress}&chain=${chainId}`;
};

export const parseUrlParams = (): { 
  storeAddress?: string; 
  chainId?: number; 
  publicAddress?: string; 
  mode?: string;
} => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    storeAddress: urlParams.get('store') || undefined,
    chainId: urlParams.get('chain') ? parseInt(urlParams.get('chain')!) : undefined,
    publicAddress: urlParams.get('address') || undefined,
    mode: urlParams.get('mode') || undefined,
  };
};

export const formatBlockNumber = (blockNumber: bigint | string | number): string => {
  const num = BigInt(blockNumber);
  return num.toLocaleString();
};

export const calculateBlockTime = (blockNumber: bigint, currentBlock: bigint): string => {
  const blockDiff = currentBlock - blockNumber;
  const secondsAgo = Number(blockDiff) * 2; // Assuming 2 second block time
  
  if (secondsAgo < 60) return `${secondsAgo}s ago`;
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
  
  return `${Math.floor(secondsAgo / 86400)}d ago`;
};

export const exportToCSV = (data: any[], filename: string): void => {
  if (!data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Type guards
export const isError = (value: any): value is Error => {
  return value instanceof Error;
};

export const hasProperty = <T extends object>(
  obj: T,
  prop: string
): prop is keyof T => {
  return prop in obj;
};