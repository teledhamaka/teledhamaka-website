import React, { useState } from 'react';
import { FiDownload, FiUpload, FiActivity } from 'react-icons/fi';

function SpeedTestWidget() {
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testPhase, setTestPhase] = useState<string | null>(null);

  const downloadTestUrl = 'https://speed.cloudflare.com/__down?bytes=1000000'; // ~10MB
  const uploadTestDataSize = 500000; // ~5MB

  const testDownloadSpeed = async () => {
    setTestPhase('download');
    const startTime = new Date().getTime();
    try {
      const response = await fetch(downloadTestUrl);
      if (response.ok) {
        const blob = await response.blob();
        const endTime = new Date().getTime();
        const duration = endTime - startTime;
        const speedMbps = (blob.size * 8) / (duration / 1000) / 1000000;
        setDownloadSpeed(speedMbps);
      } else {
        throw new Error('Download failed');
      }
    } catch {
      setDownloadSpeed(0);
    }
  };

  const testUploadSpeed = async () => {
    setTestPhase('upload');
    const startTime = new Date().getTime();
    try {
      const data = new Uint8Array(uploadTestDataSize).map((_, i) => i % 256);
      await fetch('https://speed.cloudflare.com/__up?bytes=1000000', {
        method: 'POST',
        body: data,
      });
      const endTime = new Date().getTime();
      const duration = endTime - startTime;
      const speedMbps = (uploadTestDataSize * 8) / (duration / 1000) / 1000000;
      setUploadSpeed(speedMbps);
    } catch {
      setUploadSpeed(0);
    }
  };

  const testPing = async () => {
    setTestPhase('ping');
    let totalPing = 0;
    let successfulPings = 0;
    const pingAttempts = 5;
    const pingUrl = 'https://speed.cloudflare.com';

    for (let i = 0; i < pingAttempts; i++) {
      const startTime = performance.now();
      try {
        await fetch(pingUrl, {
          method: 'HEAD',
          cache: 'no-store',
          mode: 'no-cors',
          signal: AbortSignal.timeout(1000)
        });
        const endTime = performance.now();
        const pingTime = endTime - startTime;

        if (pingTime > 0.5) {
          totalPing += pingTime;
          successfulPings++;
        }
      } catch {
        // Ignore failed pings
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const averagePing = successfulPings > 0
      ? Math.round(totalPing / successfulPings)
      : null;

    setPing(averagePing);
  };

  const startTest = async () => {
    if (isTesting) return;

    setIsTesting(true);
    setDownloadSpeed(null);
    setUploadSpeed(null);
    setPing(null);
    setTestPhase(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      await testDownloadSpeed();
      await new Promise(resolve => setTimeout(resolve, 500));
      await testUploadSpeed();
      await testPing();
    } finally {
      setIsTesting(false);
      setTestPhase(null);
    }
  };

  const SpeedIndicator = ({ value, icon, label }: { value: number | null; icon: React.ReactNode; label: string; }) => (
    <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
      <div className="flex items-center mb-2 text-blue-700">
        {icon}
        <span className="ml-2 text-sm font-medium">{label}</span>
      </div>
      <span className="text-2xl font-bold text-blue-900">
        {value === null ? (
          <span className="inline-block h-8 w-16 bg-gray-200 rounded animate-pulse"></span>
        ) : (
          `${label === 'Ping' ? value.toFixed(0) : value.toFixed(value < 10 ? 1 : 0)} ${label === 'Ping' ? 'ms' : 'Mbps'}`
        )}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6 text-center">Check Your Internet Speed</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <SpeedIndicator
          value={downloadSpeed}
          icon={<FiDownload className="w-5 h-5" />}
          label="Download" />
        <SpeedIndicator
          value={uploadSpeed}
          icon={<FiUpload className="w-5 h-5" />}
          label="Upload" />
        <SpeedIndicator
          value={ping}
          icon={<FiActivity className="w-5 h-5" />}
          label="Ping" />
      </div>

      <button
        onClick={startTest}
        disabled={isTesting}
        className={`w-full py-3 px-6 rounded-lg font-medium text-white ${isTesting ? 'bg-orange-400' : 'bg-orange-600 hover:bg-orange-700'} transition-colors shadow-md flex items-center justify-center`}
      >
        {isTesting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Testing...
          </>
        ) : (
          'Start Speed Test'
        )}
      </button>

      {testPhase && (
        <p className="mt-4 text-center text-sm text-gray-600">
          {testPhase === 'download' && 'Measuring download speed...'}
          {testPhase === 'upload' && 'Measuring upload speed...'}
          {testPhase === 'ping' && 'Measuring ping...'}
        </p>
      )}
    </div>
  );
}

export default SpeedTestWidget;