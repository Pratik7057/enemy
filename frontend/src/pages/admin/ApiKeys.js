import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/common/Card';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAllApiKeys, getApiKeyDetails, toggleApiKeyStatus, getApiUsageStats } from '../../services/admin';

const ApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState(null);
  const [selectedApiKeyLogs, setSelectedApiKeyLogs] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalApiKeys: 0,
    activeApiKeys: 0,
    blockedApiKeys: 0,
    totalApiRequests: 0,
    requestsLast24Hours: 0
  });
  useEffect(() => {
    fetchApiKeys();
    fetchApiKeyStats();
  }, [currentPage, search, statusFilter]);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await getAllApiKeys({
        page: currentPage,
        limit: 10,
        search,
        status: statusFilter
      });
      
      setApiKeys(response.data.apiKeys);
      setTotalPages(response.data.pagination.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to load API keys');
      setLoading(false);
    }
  };
    const fetchApiKeyStats = async () => {
    try {
      const response = await getApiUsageStats();
      setStats({
        totalApiKeys: response.data.totalApiKeys,
        activeApiKeys: response.data.activeApiKeys,
        blockedApiKeys: response.data.blockedApiKeys,
        totalApiRequests: response.data.totalApiRequests || 0,
        requestsLast24Hours: response.data.requestsLast24Hours || 0
      });
    } catch (error) {
      console.error('Error fetching API key stats:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchApiKeys();
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await toggleApiKeyStatus(id);
      toast.success(response.data.message);
      
      // Update the API key status in the state
      setApiKeys(apiKeys.map(key => {
        if (key.id === id) {
          return { ...key, status: key.status === 'active' ? 'blocked' : 'active' };
        }
        return key;
      }));
      
      // If we're viewing details for this key, update the selected API key
      if (selectedApiKey && selectedApiKey.id === id) {
        setSelectedApiKey({
          ...selectedApiKey,
          status: selectedApiKey.status === 'active' ? 'blocked' : 'active'
        });
      }
      
      // Refetch stats to update the counts
      fetchApiKeyStats();
    } catch (error) {
      console.error('Error toggling API key status:', error);
      toast.error('Failed to update API key status');
    }
  };
  
  const handleViewDetails = async (id) => {
    try {
      setDetailsLoading(true);
      setModalOpen(true);
      
      const response = await getApiKeyDetails(id);
      setSelectedApiKey(response.data.apiKey);
      setSelectedApiKeyLogs(response.data.logs);
      setDetailsLoading(false);
    } catch (error) {
      console.error('Error fetching API key details:', error);
      toast.error('Failed to load API key details');
      setDetailsLoading(false);
      setModalOpen(false);
    }
  };
  
  const closeModal = () => {
    setModalOpen(false);
    setSelectedApiKey(null);
    setSelectedApiKeyLogs([]);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a');
  };
  
  const getStatusBadge = (status) => {
    const baseStyles = "px-2 py-1 rounded text-xs font-medium";
    if (status === 'active') {
      return <span className={`${baseStyles} bg-green-100 text-green-800`}>✅ Active</span>;
    } else {
      return <span className={`${baseStyles} bg-red-100 text-red-800`}>❌ Blocked</span>;
    }
  };

  return (
    <AdminLayout>
      <PageHeader title="API Key Management" subtitle="Manage and monitor YouTube API keys" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white dark:bg-gray-800 shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total API Keys</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalApiKeys || 0}</p>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Active Keys</h3>
          <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">{stats.activeApiKeys || 0}</p>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Blocked Keys</h3>
          <p className="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">{stats.blockedApiKeys || 0}</p>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 shadow">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Requests</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalApiRequests || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {stats.requestsLast24Hours || 0} in the last 24 hours
          </p>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <Input
            placeholder="Search by username, email or API key"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon="search"
          />
        </div>
        
        <div className="w-full md:w-48">
          <select
            className="w-full h-10 px-3 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
        </div>
      </div>
      
      {/* API Keys Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    API Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usage Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {apiKeys.length > 0 ? (
                  apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{key.username}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{key.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">
                          {key.apiKey.substring(0, 12)}...{key.apiKey.substring(key.apiKey.length - 8)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(key.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(key.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {key.usageCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(key.id)}
                          >
                            Details
                          </Button>
                          
                          <Button
                            size="sm"
                            variant={key.status === 'active' ? 'danger' : 'success'}
                            onClick={() => handleToggleStatus(key.id)}
                          >
                            {key.status === 'active' ? 'Block' : 'Unblock'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No API keys found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && totalPages > 0 && (
          <div className="flex justify-between items-center px-6 py-3 border-t dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing page {currentPage} of {totalPages}
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* API Key Details Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">API Key Details</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {detailsLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg" />
                </div>
              ) : selectedApiKey ? (
                <div>
                  {/* API Key Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">API Key Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">User:</p>
                        <p className="font-medium text-gray-800 dark:text-white">{selectedApiKey.username} ({selectedApiKey.email})</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Status:</p>
                        <p>{getStatusBadge(selectedApiKey.status)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">API Key:</p>
                        <p className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm">{selectedApiKey.apiKey}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Created At:</p>
                        <p className="font-medium text-gray-800 dark:text-white">{formatDate(selectedApiKey.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Expires At:</p>
                        <p className="font-medium text-gray-800 dark:text-white">{formatDate(selectedApiKey.expiresAt) || 'Never'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Usage Count:</p>
                        <p className="font-medium text-gray-800 dark:text-white">{selectedApiKey.usageCount}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button
                        variant={selectedApiKey.status === 'active' ? 'danger' : 'success'}
                        onClick={() => handleToggleStatus(selectedApiKey.id)}
                      >
                        {selectedApiKey.status === 'active' ? 'Block API Key' : 'Unblock API Key'}
                      </Button>
                    </div>
                  </div>
                  
                  {/* API Usage Logs */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recent API Usage</h3>
                    
                    {selectedApiKeyLogs.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Timestamp
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Query
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                IP Address
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {selectedApiKeyLogs.map((log) => (
                              <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(log.createdAt)}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  <div className="max-w-xs truncate">{log.query}</div>
                                </td>
                                <td className="px-4 py-2 text-sm font-mono text-gray-500 dark:text-gray-400">
                                  {log.ipAddress || 'N/A'}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                  {log.status === 'success' ? (
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Success</span>
                                  ) : (
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">Failed</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No usage logs found for this API key</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Failed to load API key details</p>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ApiKeys;
