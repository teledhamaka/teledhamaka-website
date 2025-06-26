// app/coverage/page.tsx
"use client"; // Required for client-side interactivity

import { useState } from 'react';

export default function CoveragePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-blue-800">BSNL Calculators</h1>
          <p className="text-gray-600 mt-2">
            Calculate distances between towers and estimate your data usage
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <DistanceCalculator />
          <DataUsageCalculator />
        </div>
      </div>
    </div>
  );
}

// ====== Component 1: Distance Calculator ======
function DistanceCalculator() {
  const [location1, setLocation1] = useState({ lat: '', lng: '' });
  const [location2, setLocation2] = useState({ lat: '', lng: '' });
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculateDistance = () => {
    // Input validation
    if (!location1.lat || !location1.lng || !location2.lat || !location2.lng) {
      setError('Please enter both locations');
      return;
    }

    const lat1 = parseFloat(location1.lat);
    const lon1 = parseFloat(location1.lng);
    const lat2 = parseFloat(location2.lat);
    const lon2 = parseFloat(location2.lng);

    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      setError('Please enter valid coordinates');
      return;
    }

    setError('');
    
    // Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    setDistance(R * c);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Calculate Distance between two Locations on Earth
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location 1 (Lat, Long)
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Latitude"
              className="flex-1 p-2 border rounded"
              value={location1.lat}
              onChange={(e) => setLocation1({ ...location1, lat: e.target.value })}
            />
            <input
              type="text"
              placeholder="Longitude"
              className="flex-1 p-2 border rounded"
              value={location1.lng}
              onChange={(e) => setLocation1({ ...location1, lng: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location 2 (Lat, Long)
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Latitude"
              className="flex-1 p-2 border rounded"
              value={location2.lat}
              onChange={(e) => setLocation2({ ...location2, lat: e.target.value })}
            />
            <input
              type="text"
              placeholder="Longitude"
              className="flex-1 p-2 border rounded"
              value={location2.lng}
              onChange={(e) => setLocation2({ ...location2, lng: e.target.value })}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={calculateDistance}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Calculate Distance
        </button>

        {distance !== null && (
          <div className="mt-4 p-3 bg-blue-50 rounded text-center">
            <p className="font-medium">Distance Between Locations:</p>
            <p className="text-2xl font-bold text-blue-800">
              {distance.toFixed(2)} km
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ====== Component 2: Data Usage Calculator ======
function DataUsageCalculator() {
  const [dataAmount, setDataAmount] = useState('');
  const [usageType, setUsageType] = useState('browsing');
  const [result, setResult] = useState('');

  const calculateUsage = () => {
    const mb = parseFloat(dataAmount);
    if (isNaN(mb)) {
      setResult('Please enter a valid data amount');
      return;
    }

    // Generic conversion formulas (approximate)
    const conversions: Record<string, string> = {
      browsing: `${(mb / 0.5).toFixed(0)} minutes of web browsing`, // ~0.5MB per minute
      video: `${(mb / 8).toFixed(0)} minutes of HD video`, // ~8MB per minute (480p)
      music: `${(mb / 1).toFixed(0)} minutes of music streaming`, // ~1MB per minute
      social: `${(mb / 2).toFixed(0)} minutes of social media`, // ~2MB per minute
      call: `${(mb / 0.3).toFixed(0)} minutes of VoIP call` // ~0.3MB per minute
    };

    setResult(`≈ ${conversions[usageType]} (${mb} MB)`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Data Usage Calculator
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Amount (MB)
          </label>
          <input
            type="number"
            placeholder="Enter MB"
            className="w-full p-2 border rounded"
            value={dataAmount}
            onChange={(e) => setDataAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usage Type
          </label>
          <select
            className="w-full p-2 border rounded"
            value={usageType}
            onChange={(e) => setUsageType(e.target.value)}
          >
            <option value="browsing">Web Browsing</option>
            <option value="video">Video Streaming</option>
            <option value="music">Music Streaming</option>
            <option value="social">Social Media</option>
            <option value="call">Voice Calls</option>
          </select>
        </div>

        <button
          onClick={calculateUsage}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Calculate Usage
        </button>

        {result && (
          <div className="mt-4 p-3 bg-green-50 rounded">
            <p className="font-medium text-green-800">{result}</p>
            <p className="text-xs text-gray-500 mt-1">
              Note: Estimates may vary based on network conditions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}