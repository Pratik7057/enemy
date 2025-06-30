import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedService, setSelectedService] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    min: '',
    max: '',
    active: true
  });

  useEffect(() => {
    fetchServices();
  }, [categoryFilter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/admin/services${categoryFilter !== 'all' ? `?category=${categoryFilter}` : ''}`
      );
      setServices(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(service => service.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Could not load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      min: '',
      max: '',
      active: true
    });
    setModalMode('add');
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      category: service.category,
      min: service.min.toString(),
      max: service.max.toString(),
      active: service.active
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Service name is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }
    if (!formData.category.trim()) {
      toast.error('Category is required');
      return false;
    }
    if (!formData.min || isNaN(parseInt(formData.min)) || parseInt(formData.min) <= 0) {
      toast.error('Please enter a valid minimum quantity');
      return false;
    }
    if (!formData.max || isNaN(parseInt(formData.max)) || parseInt(formData.max) <= 0) {
      toast.error('Please enter a valid maximum quantity');
      return false;
    }
    if (parseInt(formData.min) > parseInt(formData.max)) {
      toast.error('Minimum quantity cannot be greater than maximum');
      return false;
    }
    return true;
  };

  const handleSaveService = async () => {
    if (!validateForm()) return;
    
    try {
      if (modalMode === 'add') {
        const response = await axios.post('/api/admin/services', {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          min: parseInt(formData.min),
          max: parseInt(formData.max),
          active: formData.active
        });
        
        setServices([...services, response.data]);
        toast.success('Service added successfully');
      } else {
        const response = await axios.put(`/api/admin/services/${selectedService._id}`, {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          min: parseInt(formData.min),
          max: parseInt(formData.max),
          active: formData.active
        });
        
        const updatedServices = services.map(service => 
          service._id === selectedService._id ? response.data : service
        );
        setServices(updatedServices);
        toast.success('Service updated successfully');
      }
      
      // Update categories list if needed
      if (!categories.includes(formData.category)) {
        setCategories([...categories, formData.category]);
      }
      
      setShowModal(false);
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    try {
      await axios.delete(`/api/admin/services/${serviceId}`);
      
      // Remove the service from the list
      setServices(services.filter(service => service._id !== serviceId));
      
      toast.success('Service deleted successfully');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error(error.response?.data?.message || 'Failed to delete service');
    }
  };

  return (
    <>
      <PageHeader title="Service Management">
        <Button onClick={openAddModal}>Add New Service</Button>
      </PageHeader>
      
      <div className="container mx-auto px-4 py-6">
        <Card>
          <div className="mb-6">
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Category
              </label>
              <select
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price (per 1K)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min / Max
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-4 text-center text-sm text-gray-500">
                        No services found
                      </td>
                    </tr>
                  ) : (
                    services.map((service) => (
                      <tr key={service._id}>
                        <td className="px-4 py-4">
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{service.description}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.category}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(service.price / 1000).toFixed(2)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.min} / {service.max}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              service.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {service.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openEditModal(service)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => handleDeleteService(service._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
      
      {/* Add/Edit Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {modalMode === 'add' ? 'Add New Service' : 'Edit Service'}
            </h3>
            
            <div className="space-y-4">
              <Input
                label="Service Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              
              <Input
                label="Price (per 1000)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                required
              />
              
              <Input
                label="Category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleInputChange}
                required
                list="categories"
              />
              <datalist id="categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Min Quantity"
                  name="min"
                  type="number"
                  value={formData.min}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Max Quantity"
                  name="max"
                  type="number"
                  value={formData.max}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="active"
                  name="active"
                  type="checkbox"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active (available for orders)
                </label>
              </div>
            </div>
            
            <div className="mt-5 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveService}>
                {modalMode === 'add' ? 'Add Service' : 'Update Service'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminServices;
