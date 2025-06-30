import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import QRCodeScanner from '../components/common/QRCodeScanner';

const PaymentMethods = [
  { 
    id: 'paypal', 
    name: 'PayPal', 
    description: 'Fast and secure payment with PayPal',
    icon: '💳'
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    description: 'Pay with cryptocurrency',
    icon: '₿'
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    description: 'Direct bank transfer to our account',
    icon: '🏦'
  },
  {
    id: 'qrcode',
    name: 'QR Code',
    description: 'Scan QR code to make payment',
    icon: '📱'
  }
];

const AddBalance = () => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const qrReaderRef = useRef(null);
  
  const navigate = useNavigate();
  const { updateUserData } = useAuth();
  
  const handleAmountChange = (e) => {
    // Only allow numbers and one decimal point
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };
  
  const selectPaymentMethod = (methodId) => {
    setSelectedMethod(methodId);
    // Reset scanner state when switching payment methods
    if (methodId !== 'qrcode') {
      setScannerActive(false);
      setScanResult(null);
    }
  };
  
  const handleQrScan = (data) => {
    if (data) {
      setScanResult(data.text);
      setScannerActive(false);
      toast.success('QR code detected!');
    }
  };
  
  const handleQrError = (err) => {
    setCameraError(err.message || 'Failed to access camera');
    toast.error('Camera error: ' + err.message);
  };
  
  const toggleScanner = () => {
    setScannerActive(prev => !prev);
    if (!scannerActive && qrReaderRef.current) {
      setCameraError(null);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    // For QR code payments, check if we have scan results
    if (selectedMethod === 'qrcode' && !scanResult) {
      toast.error('Please scan a valid QR code first');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('/api/user/add-balance', {
        amount: parseFloat(amount),
        paymentMethod: selectedMethod,
        // Include scanned data for QR payments
        qrData: selectedMethod === 'qrcode' ? scanResult : undefined
      });
      
      // Show payment details based on method
      setPaymentDetails(response.data);
      toast.success('Payment initiated! Follow the instructions to complete.');
      
      // Update user data to reflect the new balance once payment is complete
      // This is just for demo purposes - in a real app, you'd wait for payment confirmation webhook
      setTimeout(() => {
        updateUserData();
      }, 3000);
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <PageHeader title="Add Balance" />
      
      <div className="container mx-auto px-4 py-6">
        <Card>
          {paymentDetails ? (
            <div className="space-y-4">
              <h3 className="text-xl font-medium text-gray-900">Complete Your Payment</h3>
              
              {selectedMethod === 'paypal' && (
                <div className="bg-blue-50 rounded p-4 border border-blue-100">
                  <p className="mb-2">Click the button below to complete payment with PayPal:</p>
                  <Button onClick={() => window.open(paymentDetails.redirectUrl, '_blank')}>
                    Pay with PayPal
                  </Button>
                </div>
              )}
              
              {selectedMethod === 'bitcoin' && (
                <div className="bg-yellow-50 rounded p-4 border border-yellow-100">
                  <p className="mb-2">Send exactly {paymentDetails.amount} BTC to this address:</p>
                  <div className="bg-white p-3 rounded border border-gray-200 font-mono text-sm break-all">
                    {paymentDetails.address}
                  </div>
                </div>
              )}
              
              {selectedMethod === 'bank' && (
                <div className="bg-green-50 rounded p-4 border border-green-100">
                  <p className="mb-2">Bank Transfer Details:</p>
                  <div className="space-y-1">
                    <p><strong>Bank Name:</strong> {paymentDetails.bankName}</p>
                    <p><strong>Account Number:</strong> {paymentDetails.accountNumber}</p>
                    <p><strong>Reference:</strong> {paymentDetails.reference}</p>
                  </div>
                </div>
              )}
              
              {selectedMethod === 'qrcode' && (
                <div className="bg-purple-50 rounded p-4 border border-purple-100">
                  <p className="mb-2">Payment QR Code:</p>
                  <div className="flex justify-center py-4">
                    {paymentDetails.qrCodeUrl && (
                      <img 
                        src={paymentDetails.qrCodeUrl} 
                        alt="Payment QR Code" 
                        className="h-64 w-64 border-4 border-white rounded-lg shadow-lg"
                      />
                    )}
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">Scan this code with your banking app to complete payment</p>
                  <p className="text-center font-semibold mt-3">Amount: ${paymentDetails.amount}</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <Button 
                  variant="outline"
                  onClick={() => setPaymentDetails(null)}
                >
                  Start Over
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  label="Amount to Add ($)"
                  type="text"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Payment Method
                </label>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                  {PaymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border ${
                        selectedMethod === method.id
                          ? 'border-primary-500 ring-2 ring-primary-200'
                          : 'border-gray-200'
                      } rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-all`}
                      onClick={() => selectPaymentMethod(method.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{method.icon}</div>
                        <div>
                          <h4 className="font-medium">{method.name}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedMethod === 'qrcode' && (
                <div>
                  <Button
                    type="button"
                    onClick={toggleScanner}
                    className="w-full"
                  >
                    {scannerActive ? 'Stop Scanner' : 'Scan QR Code'}
                  </Button>
                    {scannerActive && (
                    <div className="mt-4">
                      <QRCodeScanner onScan={handleQrScan} />
                    </div>
                  )}
                  
                  {scanResult && (
                    <div className="mt-4 p-3 rounded bg-green-50 border border-green-100">
                      <p className="text-sm text-green-800">
                        Scanned QR Code Data:
                      </p>
                      <div className="font-mono text-sm break-all">
                        {scanResult}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <Button
                type="submit"
                fullWidth
                loading={loading}
                disabled={loading || !amount || !selectedMethod}
              >
                Continue to Payment
              </Button>
            </form>
          )}
        </Card>
      </div>
    </>
  );
};

export default AddBalance;
