import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Filter, 
  Check, 
  X, 
  Eye, 
  RefreshCw, 
  X as CloseIcon, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  FileText,
  QrCode
} from 'lucide-react';
import { walletService } from '../../services/walletService';
import { 
  WalletChangeRequest, 
  WalletChangeRequestDetail,
  ProcessWalletChangeRequest 
} from '../../services/api';
import { toast } from 'react-hot-toast';

interface WalletDetailModalProps {
  request: WalletChangeRequestDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ProcessModalProps {
  request: WalletChangeRequest | null;
  action: 'approve' | 'reject';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ProcessModal: React.FC<ProcessModalProps> = ({ 
  request, 
  action, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!request) return;

    try {
      setLoading(true);
      const data: ProcessWalletChangeRequest = {
        action,
        adminNotes: adminNotes.trim()
      };

      const response = await walletService.processWalletChangeRequest(request.requestId, data);
      
      if (response.success) {
        toast.success(`Wallet change request ${action}d successfully`);
        onSuccess();
        onClose();
      } else {
        toast.error(`Failed to ${action} wallet change request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing wallet change:`, error);
      toast.error(`Failed to ${action} wallet change request`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAdminNotes('');
    onClose();
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {action === 'approve' ? 'Approve' : 'Reject'} Wallet Change
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Request Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">User:</span>
                  <span className="font-medium text-gray-800 ml-2">{request.user.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Old Address:</span>
                  <span className="font-medium text-gray-800 ml-2 font-mono text-xs break-all">
                    {request.oldAddress}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">New Address:</span>
                  <span className="font-medium text-gray-800 ml-2 font-mono text-xs break-all">
                    {request.newAddress}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Reason:</span>
                  <span className="font-medium text-gray-800 ml-2">{request.reason}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes *
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={`Enter reason for ${action}ing this wallet change request...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                rows={4}
                required
              />
            </div>

            {action === 'reject' && (
              <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  Rejecting this request will notify the user and they may need to submit a new request.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !adminNotes.trim()}
              className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 ${
                action === 'approve' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{action === 'approve' ? 'Approving...' : 'Rejecting...'}</span>
                </div>
              ) : (
                action === 'approve' ? 'Approve' : 'Reject'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WalletDetailModal: React.FC<WalletDetailModalProps> = ({ request, isOpen, onClose }) => {
  if (!isOpen || !request) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImageUrl = (imagePath: string) => {
    const normalizedPath = imagePath.replace(/\\/g, '/');
    return `https://api.goalsbot.com/${normalizedPath}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Wallet Change Request Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* User Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-800">{request.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">{request.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-800">{request.user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-medium text-gray-800 font-mono text-sm">{request.user.id}</p>
                </div>
              </div>
            </div>

            {/* Request Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Request Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Request ID</p>
                  <p className="font-medium text-gray-800 font-mono text-sm">{request.requestId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reason</p>
                  <p className="font-medium text-gray-800">{request.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Requested At</p>
                  <p className="font-medium text-gray-800">{formatDate(request.requestedAt)}</p>
                </div>
              </div>
            </div>

            {/* Wallet Addresses */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Wallet Addresses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Old Address</h4>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-mono text-sm break-all text-gray-700">{request.oldAddress}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">New Address</h4>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-mono text-sm break-all text-gray-700">{request.newAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Codes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">QR Codes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Old QR Code</h4>
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <img
                      src={getImageUrl(request.oldQrCode)}
                      alt="Old QR Code"
                      className="w-full h-48 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCAxMDBDNjAgODkuNTQ0NyA2OC4wMDAxIDgxLjUgNzguNSAxMDBDNjguMDAwMSAxMTguNSA2MCAxMTAuNDU1IDYwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEwMCAxMDBDMTEwLjQ1NSAxMDAgMTE4LjUgOTEuOTk5OSAxMDAgMTAwQzgxLjUgMTAwIDg5LjU0NDcgMTA4LjA0NSAxMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTQwIDEwMEMxNDAgMTEwLjQ1NSAxMzEuOTk5OSAxMTguNSAxMDAgMTAwQzExOC41IDEwMCAxMjAgOTEuOTk5OSAxNDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDE0MEM5MS45OTk5IDE0MCA4OS41NDQ3IDEzMS45NTUgMTAwIDEyMEMxMTAuNDU1IDEyMCAxMTguNSAxMjguMDAwMSAxMDAgMTQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDYwQzEwOC4wNDUgNjAgMTEwLjQ1NSA2OC4wMDAxIDEwMCA3OEM5MS45OTk5IDc4IDg5LjU0NDcgNjguMDAwMSAxMDAgNjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">New QR Code</h4>
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <img
                      src={getImageUrl(request.newQrCode)}
                      alt="New QR Code"
                      className="w-full h-48 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCAxMDBDNjAgODkuNTQ0NyA2OC4wMDAxIDgxLjUgNzguNSAxMDBDNjguMDAwMSAxMTguNSA2MCAxMTAuNDU1IDYwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEwMCAxMDBDMTEwLjQ1NSAxMDAgMTE4LjUgOTEuOTk5OSAxMDAgMTAwQzgxLjUgMTAwIDg5LjU0NDcgMTA4LjA0NSAxMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDE0MEM5MS45OTk5IDE0MCA4OS41NDQ3IDEzMS45NTUgMTAwIDEyMEMxMTAuNDU1IDEyMCAxMTguNSAxMjguMDAwMSAxMDAgMTQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDYwQzEwOC4wNDUgNjAgMTEwLjQ1NSA2OC4wMDAxIDEwMCA3OEM5MS45OTk5IDc4IDg5LjU0NDcgNjguMDAwMSAxMDAgNjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WalletKYCPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [requests, setRequests] = useState<WalletChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<WalletChangeRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [processModal, setProcessModal] = useState<{
    isOpen: boolean;
    request: WalletChangeRequest | null;
    action: 'approve' | 'reject';
  }>({
    isOpen: false,
    request: null,
    action: 'approve'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  const fetchRequests = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const filters = filterStatus !== 'all' ? { status: filterStatus } : undefined;
      const response = await walletService.getWalletChangeRequests(page, 20, filters);
      
      if (response.success && response.data) {
        setRequests(response.data.requests);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.pages);
        setSummary(response.data.summary);
        toast.success('Wallet change requests loaded successfully');
      } else {
        setError('Failed to load wallet change requests');
        toast.error('Failed to load wallet change requests');
      }
    } catch (err) {
      console.error('Error fetching wallet change requests:', err);
      setError('Failed to load wallet change requests');
      toast.error('Failed to load wallet change requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const filteredRequests = requests;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewDetails = async (request: WalletChangeRequest) => {
    try {
      const response = await walletService.getWalletChangeDetails(request.requestId);
      if (response.success && response.data) {
        setSelectedRequest(response.data.request);
        setIsDetailModalOpen(true);
      } else {
        toast.error('Failed to load request details');
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error('Failed to load request details');
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  };

  const handleProcess = (request: WalletChangeRequest, action: 'approve' | 'reject') => {
    setProcessModal({
      isOpen: true,
      request,
      action
    });
  };

  const closeProcessModal = () => {
    setProcessModal({
      isOpen: false,
      request: null,
      action: 'approve'
    });
  };

  const handleProcessSuccess = () => {
    fetchRequests(currentPage); // Refresh the data
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
            <span className="text-gray-600">Loading wallet change requests...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchRequests()}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
            </div>
            <div className="bg-sky-500 rounded-full p-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{summary.pending}</p>
            </div>
            <div className="bg-orange-500 rounded-full p-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{summary.approved}</p>
            </div>
            <div className="bg-green-500 rounded-full p-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{summary.rejected}</p>
            </div>
            <div className="bg-red-500 rounded-full p-3">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Wallet Change Requests</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fetchRequests()}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <div className="flex items-center space-x-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-700">User</th>
                <th className="text-left p-4 font-medium text-gray-700">Old Address</th>
                <th className="text-left p-4 font-medium text-gray-700">New Address</th>
                <th className="text-left p-4 font-medium text-gray-700">Reason</th>
                <th className="text-left p-4 font-medium text-gray-700">Date</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No wallet change requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.requestId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <span className="font-medium text-gray-800">{request.user.name}</span>
                        <br />
                        <span className="text-sm text-gray-500">{request.user.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-gray-600 break-all">
                        {request.oldAddress.substring(0, 20)}...
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-gray-600 break-all">
                        {request.newAddress.substring(0, 20)}...
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      <span className="line-clamp-2">{request.reason}</span>
                    </td>
                    <td className="p-4 text-gray-600">{formatDate(request.requestedAt)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(request)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleProcess(request, 'approve')}
                              className="text-green-600 hover:text-green-800 p-1" 
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleProcess(request, 'reject')}
                              className="text-red-600 hover:text-red-800 p-1" 
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => fetchRequests(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchRequests(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <WalletDetailModal
        request={selectedRequest}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
      />

      <ProcessModal
        request={processModal.request}
        action={processModal.action}
        isOpen={processModal.isOpen}
        onClose={closeProcessModal}
        onSuccess={handleProcessSuccess}
      />
    </div>
  );
};

export default WalletKYCPage; 