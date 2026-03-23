'use client';

import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { ProtectedRoute } from '@/components/protected-route';
import { Navbar } from '@/components/navbar';
import { api } from '@/lib/api';

interface ScanResult {
  barcode: string;
  productName: string;
  suitable: boolean;
  restrictions: string[];
  message: string;
}

export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
    return () => {
      if (isScanning) {
        stopCamera();
      }
    };
  }, [isScanning]);

  const loadProfiles = async () => {
    try {
      const data = await api.getDietProfiles(false);
      setProfiles(data.data || []);
      if (data.data && data.data.length > 0) {
        setSelectedProfileId(data.data[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load profiles:', err);
    }
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setError(null);

      const reader = new BrowserMultiFormatReader();

      const videoElement = videoRef.current;
      if (!videoElement) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      videoElement.srcObject = stream;
      await videoElement.play();

      await reader.decodeFromVideoDevice(undefined, videoElement.id, (result, err) => {
        if (result) {
          const barcode = result.getText();
          setIsScanning(false);
          stopCamera();
          checkProduct(barcode);
        }
      });
    } catch (err: any) {
      setIsScanning(false);
      setError(err.message || 'Failed to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    const videoElement = videoRef.current;
    if (videoElement && videoElement.srcObject) {
      const stream = videoElement.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
  };

  const checkProduct = async (barcode: string) => {
    if (!selectedProfileId) {
      setError('Please select a diet profile first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponses: Record<string, ScanResult> = {
        '123456789': {
          barcode: '123456789',
          productName: 'Organic Almonds',
          suitable: true,
          restrictions: [],
          message: 'This product is suitable for your diet profile',
        },
        '987654321': {
          barcode: '987654321',
          productName: 'Dairy Milk',
          suitable: false,
          restrictions: ['dairy'],
          message: 'This product contains dairy which is restricted in your diet profile',
        },
        '456789123': {
          barcode: '456789123',
          productName: 'Gluten-Free Bread',
          suitable: true,
          restrictions: [],
          message: 'This product is perfect for your diet profile',
        },
        '321654987': {
          barcode: '321654987',
          productName: 'Beef Jerky',
          suitable: false,
          restrictions: ['pork', 'beef'],
          message: 'This product contains beef which is restricted in your diet profile',
        },
      };

      const result = mockResponses[barcode] || {
        barcode,
        productName: 'Unknown Product',
        suitable: true,
        restrictions: [],
        message: 'Product not found in database. Check ingredients manually.',
      };

      setScanResult(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to check product');
      console.error('Check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheck = () => {
    if (!manualBarcode.trim()) {
      setError('Please enter a barcode');
      return;
    }
    checkProduct(manualBarcode.trim());
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setManualBarcode('');
    setIsScanning(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Barcode Scanner
            </h1>
            <p className="text-xl text-gray-600">
              Scan products to check if they suit your diet
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Select Diet Profile
              </h2>
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a profile...</option>
                {profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                    {profile.type === 'PREDEFINED' ? ` (${profile.predefinedType})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {!scanResult && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Scan Product Barcode
                </h2>

                <div className="relative mb-6">
                  {!isScanning && (
                    <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📷</div>
                        <p className="text-gray-600 text-lg">Camera is ready</p>
                      </div>
                    </div>
                  )}

                  {isScanning && (
                    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
                      <video
                        ref={videoRef}
                        id="video-preview"
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-64 h-64 border-4 border-purple-500 rounded-lg opacity-50">
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-purple-500 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                        <div className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium animate-pulse">
                          Scanning...
                        </div>
                        <button
                          onClick={() => {
                            stopCamera();
                            setIsScanning(false);
                          }}
                          className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => {
                      if (!isScanning) startCamera();
                    }}
                    disabled={isScanning || !selectedProfileId}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isScanning ? '📷 Scanning...' : '📷 Start Camera'}
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Or enter barcode manually
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={manualBarcode}
                      onChange={(e) => setManualBarcode(e.target.value)}
                      placeholder="Enter barcode number..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={loading}
                    />
                    <button
                      onClick={handleManualCheck}
                      disabled={loading || !manualBarcode.trim() || !selectedProfileId}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? '⏳ Checking...' : '🔍 Check Product'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {scanResult && (
              <div
                className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${
                  scanResult.suitable
                    ? 'border-green-400'
                    : 'border-red-400'
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {scanResult.productName}
                    </h2>
                    <p className="text-gray-600">
                      Barcode: {scanResult.barcode}
                    </p>
                  </div>
                  <div
                    className={`px-6 py-3 rounded-xl font-bold text-lg ${
                      scanResult.suitable
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {scanResult.suitable ? '✅ Suitable' : '❌ Not Suitable'}
                  </div>
                </div>

                <div
                  className={`p-6 rounded-xl mb-6 ${
                    scanResult.suitable
                      ? 'bg-green-50'
                      : 'bg-red-50'
                  }`}
                >
                  <p className="text-lg font-medium text-gray-900">
                    {scanResult.message}
                  </p>
                </div>

                {scanResult.restrictions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Conflicts with Restrictions:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {scanResult.restrictions.map((restriction, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium"
                        >
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={resetScanner}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                  >
                    🔄 Scan Another Product
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <h3 className="text-xl font-bold text-red-900 mb-2">
                      Error
                    </h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ℹ️ How It Works
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>
                  <strong>Select your diet profile</strong> - Choose which diet profile to check against
                </li>
                <li>
                  <strong>Scan or enter barcode</strong> - Use camera or manually enter product barcode
                </li>
                <li>
                  <strong>Get instant feedback</strong> - See if product matches your dietary restrictions
                </li>
                <li>
                  <strong>View conflicts</strong> - See which ingredients don't fit your diet
                </li>
              </ol>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
