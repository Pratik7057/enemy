import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const AdminApiLogs = () => {
  const [apiLogs, setApiLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    activeKeys: 0
  });

  const statusOptions = ['all', 'success', 'error'];

  useEffect(() => {
    fetchApiLogs();
    fetchApiStats();
  }, [currentPage, search, statusFilter]);

  const fetchApiLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/admin/youtube/logs?page=${currentPage}&search=${search}&status=${statusFilter}`
      );
      setApiLogs(response.data.logs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching API logs:', error);
      toast.error('Could not load API logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchApiStats = async () => {
    try {
      const response = await axios.get('/api/admin/youtube/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching API stats:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on new filter
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeColor = (status) => {
    return status === 'success' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const formatJson = (jsonStr) => {
    try {
      return JSON.stringify(JSON.parse(jsonStr), null, 2);
    } catch (e) {
      return jsonStr || 'N/A';
    }
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleRevokeKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to revoke this API key?')) return;

    try {
      await axios.delete(`/api/admin/youtube/keys/${keyId}`);
      toast.success('API key revoked successfully');
      fetchApiLogs(); // Refresh the logs
      fetchApiStats(); // Refresh stats
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast.error(error.response?.data?.message || 'Failed to revoke API key');
    }
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this log entry?')) return;

    try {
      await axios.delete(`/api/admin/youtube/logs/${logId}`);
      setApiLogs(apiLogs.filter((log) => log._id !== logId));
      toast.success('Log entry deleted successfully');
    } catch (error) {
      console.error('Error deleting log entry:', error);
      toast.error(error.response?.data?.message || 'Failed to delete log entry');
    }
  };

  return (
    <>
      <PageHeader title="YouTube API Logs" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-blue-50 border border-blue-100">
            <div className="flex flex-col">
              <p className="text-sm text-blue-600 font-medium">Total API Calls</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
          </Card>
          <Card className="bg-green-50 border border-green-100">
            <div className="flex flex-col">
              <p className="text-sm text-green-600 font-medium">Successful Calls</p>
              <p className="text-2xl font-bold text-green-700">{stats.successful}</p>
            </div>
          </Card>
          <Card className="bg-red-50 border border-red-100">
            <div className="flex flex-col">
              <p className="text-sm text-red-600 font-medium">Failed Calls</p>
              <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
            </div>
          </Card>
          <Card className="bg-purple-50 border border-purple-100">
            <div className="flex flex-col">
              <p className="text-sm text-purple-600 font-medium">Active API Keys</p>
              <p className="text-2xl font-bold text-purple-700">{stats.activeKeys}</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <Input
                label="Search Logs"
                type="text"
                id="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="User, API key, IP address..."
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
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
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        API Key
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Endpoint
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {apiLogs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-4 text-center text-sm text-gray-500">
                          No logs found
                        </td>
                      </tr>
                    ) : (
                      apiLogs.map((log) => (
                        <tr key={log._id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.user ? log.user.username : 'N/A'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {truncateText(log.apiKey)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {truncateText(log.endpoint)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                                log.status
                              )}`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.ipAddress || 'N/A'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewDetails(log)}
                              >
                                Details
                              </Button>
                              <Button 
                                variant="danger" 
                                size="sm" 
                                onClick={() => handleDeleteLog(log._id)}
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

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                          currentPage === 1
                            ? 'cursor-not-allowed'
                            : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        &larr;
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                        {currentPage}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                          currentPage === totalPages
                            ? 'cursor-not-allowed'
                            : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        &rarr;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Log Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">API Log Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">User</p>
                <p className="text-base">{selectedLog.user ? selectedLog.user.username : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-base">{formatDate(selectedLog.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">API Key</p>
                <p className="text-base font-mono">{selectedLog.apiKey}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                    selectedLog.status
                  )}`}
                >
                  {selectedLog.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Endpoint</p>
                <p className="text-base">{selectedLog.endpoint}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">IP Address</p>
                <p className="text-base">{selectedLog.ipAddress || 'N/A'}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Request Params</p>
              <div className="bg-gray-50 p-3 rounded-md overflow-x-auto">
                <pre className="text-sm">{formatJson(selectedLog.requestParams)}</pre>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Response</p>
              <div className="bg-gray-50 p-3 rounded-md overflow-x-auto max-h-60">
                <pre className="text-sm">{formatJson(selectedLog.response)}</pre>
              </div>
            </div>
            
            {selectedLog.error && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Error</p>
                <div className="bg-red-50 p-3 rounded-md overflow-x-auto">
                  <pre className="text-sm text-red-800">{formatJson(selectedLog.error)}</pre>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-4">
              {selectedLog.apiKey && (
                <Button 
                  variant="danger"
                  onClick={() => {
                    handleRevokeKey(selectedLog.apiKeyId);
                    setShowDetailModal(false);
                  }}
                >
                  Revoke API Key
                </Button>
              )}
              <Button onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminApiLogs;
