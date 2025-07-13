// TypeScript interfaces for blockchain components

export interface Field {
  name: string;
  unit: string;
  dtype: string;
}

export interface SensorRecord {
  sensor: string;
  timestamp: number;
  values: number[];
  block: string;
  txHash: string;
}

export interface StoreMetadata {
  deployedBlock: bigint;
  lastUpdatedBlock: bigint;
  description: string;
  pointer: string;
}

export interface StoreData {
  address: string;
  nickname: string;
  description: string;
  pointer: string;
  owner: string;
  fields: Field[];
  authorizedSensors: string[];
  sensorRecords: SensorRecord[];
  totalRecords: number;
  deployedBlock?: bigint;
  lastUpdatedBlock?: bigint;
  isOwner?: boolean;
}

export interface Store {
  address: string;
  nickname: string;
}

export interface BlockchainState {
  walletClient: any | null;
  publicClient: any | null;
  account: string | null;
  chainId: number;
  currentBlock: bigint | null;
}

export interface UIState {
  loading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  viewMode: 'public' | 'wallet' | 'direct';
}

export interface ChartTimeRange {
  label: string;
  hours: number;
}

export interface ComponentProps {
  theme: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export interface StoreInfoProps extends ComponentProps {
  storeData: StoreData;
  isOwner: boolean;
  currentBlock?: bigint | null;
}

export interface SensorDataProps extends ComponentProps {
  storeAddress: string;
  fields: Field[];
  publicClient: any;
  currentBlock?: bigint | null;
}

export interface VisualizationProps extends ComponentProps {
  storeData: StoreData;
  currentBlock?: bigint | null;
}

export interface ConnectionProps extends ComponentProps {
  walletClient?: any | null;
  publicClient?: any | null;
  account?: string | null;
  chainId: number;
  onConnect: () => Promise<void>;
  onChainChange: (chainId: number) => Promise<void>;
}

export interface ViewModeProps extends ComponentProps {
  viewMode: 'public' | 'wallet' | 'direct';
  onViewModeChange: (mode: 'public' | 'wallet' | 'direct') => void;
}

export interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export interface BlockIndicatorProps extends ComponentProps {
  currentBlock: bigint | null;
  chainId: number;
  isConnected: boolean;
}

export interface ChainConfig {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: { http: string[] };
    public: { http: string[] };
  };
  blockExplorers?: {
    default: { name: string; url: string };
  };
}

export interface ContractConfig {
  DEPLOYER_ADDRESS: string;
  EXPLORER_URL: string;
}

export interface ExportData {
  timestamp: string;
  sensor: string;
  block: string;
  txHash: string;
  [key: string]: string | number;
}