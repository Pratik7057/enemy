import React, { useState } from 'react';
import QrReader from 'react-qr-scanner';

const QRCodeScanner = ({ onScan }) => {
  const [error, setError] = useState(null);
  
  const handleScan = (data) => {
    if (data) {
      onScan(data.text);
    }
  };

  const handleError = (err) => {
    setError(err);
  };

  return (
    <div className="qr-scanner-container p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Scan Payment QR Code</h3>
      {error && <p className="text-red-500 mb-2">Error: {error.message}</p>}
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}
        className="rounded-lg overflow-hidden shadow-lg"
      />
      <p className="mt-2 text-sm text-gray-600">Position the QR code in the center of the camera</p>
    </div>
  );
};

export default QRCodeScanner;
