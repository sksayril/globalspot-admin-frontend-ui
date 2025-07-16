import React, { useState, useEffect } from 'react';
import { Wallet, Filter, Check, X, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { apiClient, WithdrawalRequest, ApproveWithdrawalRequest, RejectWithdrawalRequest } from '../../services/api';
import { toast } from 'react-hot-toast';
import { dashboardService } from '../../services/dashboardService';

interface WithdrawalRequestModalProps {
  request: WithdrawalRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: 'approve' | 'reject' | 'view';
}

const WithdrawalRequestModal: React.FC<WithdrawalRequestModalProps> = ({
  request,
  isOpen,
  onClose,
  onSuccess,
  type
}) => {
  const [formData, setFormData] = useState({
    transactionHash: '',
    notes: '',
    rejectionReason: ''
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        transactionHash: '',
        notes: '',
        rejectionReason: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!request) return;

    if (type === 'approve' && !formData.transactionHash.trim()) {
      toast.error('Please enter a transaction hash');
      return;
    }

    if (type === 'reject' && !formData.rejectionReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }

    try {
      setLoading(true);
      
      if (type === 'approve') {
        const approveData: ApproveWithdrawalRequest = {
          transactionHash: formData.transactionHash.trim(),
          notes: formData.notes.trim() || undefined,
        };
        await apiClient.approveWithdrawalRequest(request._id, approveData);
        toast.success('Withdrawal request approved successfully');
      } else {
        const rejectData: RejectWithdrawalRequest = {
          rejectionReason: formData.rejectionReason.trim(),
        };
        await apiClient.rejectWithdrawalRequest(request._id, rejectData);
        toast.success('Withdrawal request rejected successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error(`Error ${type === 'approve' ? 'approving' : 'rejecting'} withdrawal request:`, error);
      toast.error(`Failed to ${type} withdrawal request`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (request?.walletAddress) {
      navigator.clipboard.writeText(request.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {type === 'approve' ? 'Approve' : type === 'reject' ? 'Reject' : 'View'} Withdrawal Request
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Request Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">User:</span>
                  <span className="font-medium">{request.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{request.userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">${request.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Wallet:</span>
                  <span className="font-mono text-xs break-all flex items-center gap-2">
                    {request.walletAddress}
                    <button
                      onClick={handleCopy}
                      className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                      title="Copy Wallet Address"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wallet Type:</span>
                  <span className="font-medium">{request.walletType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{request.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(request.createdAt).toLocaleString()}</span>
                </div>
                {request.transactionHash && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Txn Hash:</span>
                    <span className="font-mono text-xs break-all">{request.transactionHash}</span>
                  </div>
                )}
                {request.notes && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notes:</span>
                    <span className="font-medium">{request.notes}</span>
                  </div>
                )}
                {request.rejectionReason && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rejection Reason:</span>
                    <span className="font-medium">{request.rejectionReason}</span>
                  </div>
                )}
              </div>
            </div>

            {type === 'approve' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Hash *
                  </label>
                  <input
                    type="text"
                    value={formData.transactionHash}
                    onChange={(e) => setFormData({ ...formData, transactionHash: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Enter transaction hash"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    placeholder="Enter notes"
                  />
                </div>
              </div>
            ) : type === 'reject' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason *
                </label>
                <textarea
                  value={formData.rejectionReason}
                  onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  placeholder="Enter rejection reason"
                />
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {type === 'approve' || type === 'reject' ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  type === 'approve'
                    ? 'bg-green-500 hover:bg-green-600 disabled:bg-green-300'
                    : 'bg-red-500 hover:bg-red-600 disabled:bg-red-300'
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  type === 'approve' ? 'Approve' : 'Reject'
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const WithdrawalRequestsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [modalType, setModalType] = useState<'approve' | 'reject' | 'view'>('approve');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardService.getWithdrawalRequests();
      if (Array.isArray(data)) {
        setRequests(data);
        setTotalRequests(data.length);
      } else {
        setRequests([]);
        setTotalRequests(0);
      }
    } catch (err) {
      setError('Failed to load withdrawal requests');
      toast.error('Failed to load withdrawal requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setModalType('approve');
    setIsModalOpen(true);
  };

  const handleReject = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setModalType('reject');
    setIsModalOpen(true);
  };

  const handleView = (request: WithdrawalRequest) => {
    setSelectedRequest(request);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchRequests();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(request => 
    filterStatus === 'all' || request.status === filterStatus
  );

  console.log('requests:', requests);
  console.log('filteredRequests:', filteredRequests);
  console.log('filterStatus:', filterStatus);

  const totalAmount = requests.reduce((sum, req) => sum + req.amount, 0);
  const pendingCount = requests.filter(req => req.status === 'pending').length;
  const approvedCount = requests.filter(req => req.status === 'approved').length;
  const rejectedCount = requests.filter(req => req.status === 'rejected').length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
            <span className="text-gray-600">Loading withdrawal requests...</span>
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
              <p className="text-2xl font-bold text-gray-800">{totalRequests}</p>
            </div>
            <div className="bg-sky-500 rounded-full p-3">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-800">${totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-green-500 rounded-full p-3">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
            </div>
            <div className="bg-orange-500 rounded-full p-3">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="bg-purple-500 rounded-full p-3">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Withdrawal Requests</h2>
          <div className="flex items-center space-x-4">
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
                         <button
               onClick={() => fetchRequests()}
               className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
             >
               <RefreshCw className="w-4 h-4" />
               <span>Refresh</span>
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-4 font-medium text-gray-700">User</th>
                <th className="text-left p-4 font-medium text-gray-700">Amount</th>
                <th className="text-left p-4 font-medium text-gray-700">Wallet Address</th>
                <th className="text-left p-4 font-medium text-gray-700">Wallet Type</th>
                <th className="text-left p-4 font-medium text-gray-700">Date</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <span className="font-medium text-gray-800">{request.userName}</span>
                        <br />
                        <span className="text-sm text-gray-500">{request.userEmail}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-800">${request.amount.toLocaleString()}</span>
                    </td>
                    <td className="p-4 text-gray-600">
                      <span className="font-mono text-sm">{request.walletAddress.slice(0, 10)}...</span>
                    </td>
                    <td className="p-4 text-gray-600 capitalize">{request.walletType}</td>
                    <td className="p-4 text-gray-600">{formatDate(request.createdAt)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View Details"
                          onClick={() => handleView(request)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(request)}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleReject(request)}
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


      </div>

      <WithdrawalRequestModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        type={modalType}
      />
    </div>
  );
};

export default WithdrawalRequestsPage;