import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const PlaceOrder = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [link, setLink] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  const navigate = useNavigate();
  const { user, updateUserData } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService && quantity) {
      calculateCost();
    } else {
      setTotalCost(0);
    }
  }, [selectedService, quantity]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/services');
      setServices(response.data);

      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(service => service.category))];
      setCategories(uniqueCategories);

      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Could not load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateCost = () => {
    if (!selectedService || !quantity || isNaN(parseFloat(quantity))) {
      setTotalCost(0);
      return;
    }

    const service = services.find(s => s._id === selectedService);
    if (!service) {
      setTotalCost(0);
      return;
    }

    const cost = service.price * parseInt(quantity, 10) / 1000;
    setTotalCost(cost);
  };

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedService(null);
  };

  const handleServiceChange = (serviceId) => {
    setSelectedService(serviceId);
    
    // Reset quantity if min/max requirements change
    const service = services.find(s => s._id === serviceId);
    if (service && quantity) {
      const quantityNum = parseInt(quantity, 10);
      if (quantityNum < service.min || quantityNum > service.max) {
        setQuantity('');
      }
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const validateOrder = () => {
    if (!selectedService) {
      toast.error('Please select a service');
      return false;
    }

    const service = services.find(s => s._id === selectedService);
    if (!service) {
      toast.error('Invalid service selected');
      return false;
    }

    if (!quantity) {
      toast.error('Please enter quantity');
      return false;
    }

    const quantityNum = parseInt(quantity, 10);
    if (isNaN(quantityNum)) {
      toast.error('Please enter a valid quantity');
      return false;
    }

    if (quantityNum < service.min) {
      toast.error(`Minimum quantity is ${service.min}`);
      return false;
    }

    if (quantityNum > service.max) {
      toast.error(`Maximum quantity is ${service.max}`);
      return false;
    }

    if (!link) {
      toast.error('Please enter a link');
      return false;
    }

    if (totalCost > user.balance) {
      toast.error('Insufficient balance. Please add funds to your account.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateOrder()) return;

    setSubmitting(true);

    try {
      const response = await axios.post('/api/orders', {
        serviceId: selectedService,
        quantity: parseInt(quantity, 10),
        link
      });

      toast.success('Order placed successfully!');
      updateUserData(); // Update user balance
      navigate('/orders');
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = services.filter(
    service => service.category === selectedCategory
  );

  const getSelectedServiceDetails = () => {
    return services.find(s => s._id === selectedService);
  };

  return (
    <>
      <PageHeader title="Place New Order" />
      
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
                <div className="space-y-1">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`block w-full text-left px-4 py-2 rounded-md ${
                        selectedCategory === category
                          ? 'bg-primary-100 text-primary-700'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleCategoryChange(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Place Order</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Service
                    </label>
                    <div className="bg-gray-50 rounded-md p-4 max-h-60 overflow-y-auto">
                      {filteredServices.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No services available in this category</p>
                      ) : (
                        <div className="space-y-2">
                          {filteredServices.map(service => (
                            <div
                              key={service._id}
                              className={`p-3 border rounded-md cursor-pointer ${
                                selectedService === service._id
                                  ? 'border-primary-500 bg-primary-50'
                                  : 'border-gray-200 hover:border-primary-300'
                              }`}
                              onClick={() => handleServiceChange(service._id)}
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">{service.name}</span>
                                <span className="text-sm">${(service.price / 1000).toFixed(2)} per 1000</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                              <div className="text-xs text-gray-400 mt-2">
                                Min: {service.min} | Max: {service.max}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedService && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Quantity"
                          type="text"
                          id="quantity"
                          value={quantity}
                          onChange={handleQuantityChange}
                          placeholder={`Min: ${getSelectedServiceDetails()?.min || 0} - Max: ${
                            getSelectedServiceDetails()?.max || 1000
                          }`}
                          required
                        />
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cost
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="text"
                              className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-gray-50"
                              value={totalCost.toFixed(2)}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Input
                        label="Link"
                        type="text"
                        id="link"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://"
                        required
                      />
                      
                      <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                              {getSelectedServiceDetails()?.name} - Service Information
                            </h3>
                            <div className="mt-2 text-sm text-blue-700">
                              <p>{getSelectedServiceDetails()?.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">
                            Your balance: <span className="font-semibold">${user?.balance?.toFixed(2)}</span>
                          </p>
                          {totalCost > (user?.balance || 0) && (
                            <p className="text-sm text-red-600">
                              Insufficient balance. Please add funds.
                            </p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          loading={submitting}
                          disabled={submitting || totalCost > (user?.balance || 0)}
                        >
                          Place Order
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlaceOrder;
