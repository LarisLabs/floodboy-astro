import type { ViewModeProps } from '../../../types/blockchain';
import { getTabClasses } from '../../../utils/theme-utils';

export const ViewModeTabs = ({ 
  viewMode, 
  onViewModeChange, 
  theme = 'dark' 
}: ViewModeProps) => {
  const tabs = [
    { key: 'public' as const, label: 'Public Stores', icon: '🔍' },
    { key: 'direct' as const, label: 'Direct Store View', icon: '🎯' },
    { key: 'wallet' as const, label: 'Connect Wallet', icon: '👛' },
  ];

  return (
    <div className="flex space-x-4 mb-8 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onViewModeChange(tab.key)}
          className={getTabClasses(theme, viewMode === tab.key)}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};