import React, { useState, useEffect } from 'react';
import SensorVisualizationP5 from './SensorVisualizationP5';
import P5Loader from './P5Loader';

const P5Demo: React.FC = () => {
  // Sensor states
  const [waterLevel, setWaterLevel] = useState(1.5);
  const [airLevel, setAirLevel] = useState(2.3);
  const [sensorMode, setSensorMode] = useState<'water' | 'air'>('water');
  const [installationHeight, setInstallationHeight] = useState(2.5);
  const [showMeasurement, setShowMeasurement] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isDead, setIsDead] = useState(false);
  
  // Mock data presets (with realistic relationships)
  const mockDataPresets = {
    normal: { 
      waterLevel: Math.min(0.5, installationHeight), 
      airLevel: installationHeight - 0.5, // Air distance to water surface
      isOnline: true, 
      isDead: false 
    },
    flooding: { 
      waterLevel: Math.min(installationHeight * 0.8, installationHeight), // 80% of installation height
      airLevel: installationHeight * 0.2, // Small air gap
      isOnline: true, 
      isDead: false 
    },
    dry: { 
      waterLevel: 0, 
      airLevel: installationHeight, // Measuring to ground
      isOnline: true, 
      isDead: false 
    },
    offline: { 
      waterLevel: Math.min(0.3, installationHeight), 
      airLevel: installationHeight - 0.3, 
      isOnline: false, 
      isDead: false 
    },
    dead: { 
      waterLevel: Math.min(installationHeight * 0.6, installationHeight), 
      airLevel: installationHeight * 0.4, 
      isOnline: false, 
      isDead: true 
    }
  };
  
  // Apply preset
  const applyPreset = (preset: keyof typeof mockDataPresets) => {
    const data = mockDataPresets[preset];
    // Ensure water level doesn't exceed installation height
    setWaterLevel(Math.min(data.waterLevel, installationHeight));
    setAirLevel(data.airLevel);
    setIsOnline(data.isOnline);
    setIsDead(data.isDead);
  };
  
  // Handle installation height changes
  useEffect(() => {
    // If water level exceeds new installation height, adjust it
    if (waterLevel > installationHeight) {
      setWaterLevel(installationHeight);
    }
  }, [installationHeight, waterLevel]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          IoT Sensor Visualization with p5.js
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visualization Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Sensor Visualization</h2>
            <div className="flex justify-center items-center mb-4 bg-gray-50 rounded-lg" style={{ minHeight: '450px' }}>
              <P5Loader>
                <SensorVisualizationP5 
                  waterLevel={waterLevel}
                  airLevel={airLevel}
                  sensorMode={sensorMode}
                  installationHeight={installationHeight}
                  showMeasurement={showMeasurement}
                  isOnline={isOnline}
                  isDead={isDead}
                />
              </P5Loader>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setSensorMode('water')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  sensorMode === 'water' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Water Mode
              </button>
              <button
                onClick={() => setSensorMode('air')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  sensorMode === 'air' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Air Mode
              </button>
            </div>
          </div>
          
          {/* Controls Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Mock Data Controls</h2>
            
            {/* Preset Buttons */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Quick Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyPreset('normal')}
                  className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Normal
                </button>
                <button
                  onClick={() => applyPreset('flooding')}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Flooding
                </button>
                <button
                  onClick={() => applyPreset('dry')}
                  className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                >
                  Dry
                </button>
                <button
                  onClick={() => applyPreset('offline')}
                  className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                >
                  Offline
                </button>
                <button
                  onClick={() => applyPreset('dead')}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors col-span-2"
                >
                  Dead Sensor
                </button>
              </div>
            </div>
            
            {/* Manual Controls */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Water Level: {waterLevel.toFixed(2)}m 
                  {waterLevel >= installationHeight && <span className="text-red-600 text-xs ml-2">(MAX)</span>}
                </label>
                <input
                  type="range"
                  min="0"
                  max={installationHeight}
                  step="0.1"
                  value={waterLevel}
                  onChange={(e) => setWaterLevel(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0m</span>
                  <span>{installationHeight.toFixed(1)}m (max)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Air Distance: {airLevel.toFixed(2)}m
                  {airLevel > installationHeight && <span className="text-orange-600 text-xs ml-2">(Above typical)</span>}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={airLevel}
                  onChange={(e) => setAirLevel(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0m</span>
                  <span className="text-center">{installationHeight.toFixed(1)}m (typical)</span>
                  <span>5m</span>
                </div>
                {/* Visual indicator for typical range */}
                <div className="relative h-1 bg-gray-200 rounded-full mt-1">
                  <div 
                    className="absolute h-1 bg-green-400 rounded-full"
                    style={{ width: `${(installationHeight / 5) * 100}%` }}
                  />
                  <div 
                    className="absolute h-1 bg-orange-400 rounded-full"
                    style={{ 
                      left: `${(installationHeight / 5) * 100}%`,
                      width: `${((5 - installationHeight) / 5) * 100}%`
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Installation Height: {installationHeight.toFixed(1)}m
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={installationHeight}
                  onChange={(e) => setInstallationHeight(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Set Zero Calibration Button */}
            <div className="mt-6 mb-4">
              <button
                onClick={() => {
                  // Set installation height to current air distance
                  setInstallationHeight(airLevel);
                  // Switch to water mode
                  setSensorMode('water');
                  // Set water level to 0 (ground level)
                  setWaterLevel(0);
                }}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
              >
                Set Zero (Calibrate from Air Distance)
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Sets installation height from current air distance and switches to water mode
              </p>
            </div>
            
            {/* Toggle Options */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showMeasurement}
                  onChange={(e) => setShowMeasurement(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Show Measurements</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Sensor Online</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isDead}
                  onChange={(e) => setIsDead(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Sensor Dead/Error</span>
              </label>
            </div>
            
            {/* Current Status */}
            <div className="mt-6 p-4 bg-gray-50 rounded">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Status</h3>
              <div className="text-xs space-y-1">
                <p>Mode: <span className="font-mono">{sensorMode}</span></p>
                <p>Water Level: <span className="font-mono">{waterLevel.toFixed(2)}m</span></p>
                <p>Air Distance: <span className="font-mono">{airLevel.toFixed(2)}m</span></p>
                <p>Status: <span className={`font-bold ${isDead ? 'text-red-600' : isOnline ? 'text-green-600' : 'text-orange-600'}`}>
                  {isDead ? 'DEAD' : isOnline ? 'ONLINE' : 'OFFLINE'}
                </span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P5Demo;