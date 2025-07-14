import React, { useState, useEffect } from 'react';
import FloodboyVisualization from './FloodboyVisualization';
import P5Loader from './P5Loader';

const App: React.FC = () => {
  const [waterLevel, setWaterLevel] = useState(1.5);
  const [airLevel, setAirLevel] = useState(2.0);
  const [sensorMode, setSensorMode] = useState<'water' | 'air'>('water');
  const [installationHeight, setInstallationHeight] = useState(2.5);
  const [showMeasurement, setShowMeasurement] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isDead, setIsDead] = useState(false);

  // Constrain water level to not exceed installation height
  useEffect(() => {
    if (waterLevel > installationHeight) {
      setWaterLevel(installationHeight);
    }
  }, [installationHeight, waterLevel]);

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

  const calibrateSensor = () => {
    const currentReading = sensorMode === 'water' ? waterLevel : airLevel;
    setInstallationHeight(currentReading);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Floodboy Sensor Visualization
          </h1>
          <p className="text-gray-600">
            Interactive IoT flood monitoring sensor simulator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visualization */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Sensor Visualization</h2>
            <div className="flex justify-center mb-4">
              <P5Loader>
                <FloodboyVisualization
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
            <div className="flex justify-center gap-4">
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

          {/* Controls */}
          <div className="space-y-6">
            {/* Preset Scenarios */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Preset Scenarios</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => applyPreset('normal')}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Normal
                </button>
                <button
                  onClick={() => applyPreset('flooding')}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Flooding
                </button>
                <button
                  onClick={() => applyPreset('dry')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Dry
                </button>
                <button
                  onClick={() => applyPreset('offline')}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                >
                  Offline
                </button>
                <button
                  onClick={() => applyPreset('dead')}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition col-span-2"
                >
                  Dead Sensor
                </button>
              </div>
            </div>

            {/* Manual Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Manual Controls</h3>
              
              <div className="space-y-4">
                {/* Sensor Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sensor Mode
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSensorMode('water')}
                      className={`px-4 py-2 rounded ${
                        sensorMode === 'water'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Water Level
                    </button>
                    <button
                      onClick={() => setSensorMode('air')}
                      className={`px-4 py-2 rounded ${
                        sensorMode === 'air'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Air Distance
                    </button>
                  </div>
                </div>

                {/* Water Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Level: {waterLevel.toFixed(2)}m
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
                </div>

                {/* Air Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Air Distance: {airLevel.toFixed(2)}m
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
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={showMeasurement}
                      onChange={(e) => setShowMeasurement(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Show Measurements</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isOnline}
                      onChange={(e) => setIsOnline(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Sensor Online</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isDead}
                      onChange={(e) => setIsDead(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Hardware Failure</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Calibration */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Calibration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Installation Height: {installationHeight.toFixed(2)}m
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={installationHeight}
                    onChange={(e) => setInstallationHeight(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <button
                  onClick={calibrateSensor}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Set Zero (Calibrate to Current Reading)
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;