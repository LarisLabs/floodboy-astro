import React from 'react';

interface SensorData {
  id: string;
  name: string;
  location: string;
  waterLevel: number;
  status: 'online' | 'offline' | 'warning' | 'critical';
  lastUpdate: string;
  batteryLevel: number;
}

const Dashboard: React.FC = () => {
  // Mock sensor data - in production this would come from an API
  const sensors: SensorData[] = [
    {
      id: 'FB001',
      name: 'Main Street Bridge',
      location: 'Downtown',
      waterLevel: 0.45,
      status: 'online',
      lastUpdate: '2 min ago',
      batteryLevel: 85
    },
    {
      id: 'FB002',
      name: 'River Park North',
      location: 'North District',
      waterLevel: 1.2,
      status: 'warning',
      lastUpdate: '5 min ago',
      batteryLevel: 72
    },
    {
      id: 'FB003',
      name: 'Industrial Canal',
      location: 'East Zone',
      waterLevel: 2.1,
      status: 'critical',
      lastUpdate: '1 min ago',
      batteryLevel: 45
    },
    {
      id: 'FB004',
      name: 'Coastal Highway',
      location: 'South Beach',
      waterLevel: 0.3,
      status: 'online',
      lastUpdate: '3 min ago',
      batteryLevel: 91
    },
    {
      id: 'FB005',
      name: 'University Creek',
      location: 'West Campus',
      waterLevel: 0.0,
      status: 'offline',
      lastUpdate: '2 hours ago',
      batteryLevel: 5
    }
  ];

  const getStatusColor = (status: SensorData['status']) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
    }
  };

  const getWaterLevelColor = (level: number) => {
    if (level >= 2.0) return 'text-red-600';
    if (level >= 1.0) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const stats = {
    totalSensors: sensors.length,
    onlineSensors: sensors.filter(s => s.status !== 'offline').length,
    criticalAlerts: sensors.filter(s => s.status === 'critical').length,
    warningAlerts: sensors.filter(s => s.status === 'warning').length,
    avgWaterLevel: (sensors.reduce((sum, s) => sum + s.waterLevel, 0) / sensors.length).toFixed(2)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Floodboy Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time flood monitoring system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Sensors</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalSensors}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Online</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{stats.onlineSensors}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{stats.criticalAlerts}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Warnings</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.warningAlerts}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Avg Water Level</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{stats.avgWaterLevel}m</p>
          </div>
        </div>

        {/* Alert Banner */}
        {stats.criticalAlerts > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Critical Alert: {stats.criticalAlerts} sensor{stats.criticalAlerts > 1 ? 's' : ''} detecting high water levels
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Immediate attention required for flood risk areas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sensors Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Sensor Status</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sensor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Water Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Battery
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Update
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sensors.map((sensor) => (
                  <tr key={sensor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{sensor.name}</div>
                        <div className="text-sm text-gray-500">{sensor.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sensor.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getWaterLevelColor(sensor.waterLevel)}`}>
                        {sensor.waterLevel}m
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sensor.status)}`}>
                        {sensor.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm ${sensor.batteryLevel < 20 ? 'text-red-600' : 'text-gray-900'}`}>
                          {sensor.batteryLevel}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sensor.lastUpdate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="/sensors"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View All Sensors
          </a>
          <a
            href="/analytics"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
          >
            Analytics
          </a>
          <a
            href="/demo"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Sensor Demo
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;