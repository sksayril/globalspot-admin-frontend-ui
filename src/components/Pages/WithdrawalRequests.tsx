import React, { useState, useEffect } from 'react';
import { Wallet, Filter, Check, X, Eye, RefreshCw, AlertCircle, QrCode } from 'lucide-react';
import { apiClient, WithdrawalRequest, ApproveWithdrawalRequest, RejectWithdrawalRequest } from '../../services/api';
import { toast } from 'react-hot-toast';
import { dashboardService } from '../../services/dashboardService';
import { MobileTable } from '../Common';

interface WithdrawalRequestModalProps {
  request: WithdrawalRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: 'approve' | 'reject' | 'view';
  onViewQRCode: (imageUrl: string) => void;
}

interface QRCodeModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawalRequestModal: React.FC<WithdrawalRequestModalProps> = ({
  request,
  isOpen,
  onClose,
  onSuccess,
  type,
  onViewQRCode
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
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
                {request.withdrawalWalletText && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wallet Text:</span>
                    <span className="font-medium">{request.withdrawalWalletText}</span>
                  </div>
                )}
                {request.withdrawalWalletImage && (
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">QR Code:</span>
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-gray-500" />
                      <button
                        onClick={() => {
                          if (request.withdrawalWalletImage) {
                            onViewQRCode(request.withdrawalWalletImage);
                          }
                        }}
                        className="w-16 h-16 border rounded overflow-hidden hover:border-sky-500 transition-colors"
                        title="Click to view larger QR code"
                      >
                        <img
                          src={request.withdrawalWalletImage}
                          alt="Wallet QR Code"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEMyNCAyMS43OTA5IDI1Ljc5MDkgMjAgMjggMjBDMzAuMjA5MSAyMCAzMiAyMS43OTA5IDMyIDI0QzMyIDI2LjIwOTEgMzAuMjA5MSAyOCAyOCAyOEMyNS43OTA5IDI4IDI0IDI2LjIwOTEgMjQgMjRaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNiA0NEMxNiAzOS41ODE3IDE5LjU4MTcgMzYgMjQgMzZINDBDNDQuNDE4MyAzNiA0OCAzOS41ODE3IDQ4IDQ0VjQ4SDE2VjQ0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                          }}
                        />
                      </button>
                    </div>
                  </div>
                )}
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

const QRCodeModal: React.FC<QRCodeModalProps> = ({ imageUrl, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Wallet QR Code</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-center">
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <img
                src={imageUrl}
                alt="Wallet QR Code"
                className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02NCA2NEM2NCA0Ni44ODU4IDc4Ljg4NTggMzIgOTYgMzJIMTYwQzE3Ny4xMTQgMzIgMTkyIDQ2Ljg4NTggMTkyIDY0VjE2MEMxOTIgMTc3LjExNCAxNzcuMTE0IDE5MiAxNjAgMTkySDk2Qzc4Ljg4NTggMTkyIDY0IDE3Ny4xMTQgNjQgMTYwVjY0WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTI4IDEyOEMxMjggMTE5LjE2MyAxMzUuMTYzIDExMiAxNDQgMTEyQzE1Mi44MzcgMTEyIDE2MCAxMTkuMTYzIDE2MCAxMjhDMTYwIDEzNi44MzcgMTUyLjgzNyAxNDQgMTQ0IDE0NEMxMzUuMTYzIDE0NCAxMjggMTM2LjgzNyAxMjggMTI4WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTI4IDE5MkMxMjggMTgzLjE2MyAxMzUuMTYzIDE3NiAxNDQgMTc2QzE1Mi44MzcgMTc2IDE2MCAxODMuMTYzIDE2MCAxOTJDMTYwIDIwMC44MzcgMTUyLjgzNyAyMDggMTQ0IDIwOEMxMzUuMTYzIDIwOCAxMjggMjAwLjgzNyAxMjggMTkyWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTI4IDY0QzEyOCA1NS4xNjMgMTM1LjE2MyA0OCAxNDQgNDhDMTUyLjgzNyA0OCAxNjAgNTUuMTYzIDE2MCA2NEMxNjAgNzIuODM3IDE1Mi44MzcgODAgMTQ0IDgwQzEzNS4xNjMgODAgMTI4IDcyLjgzNyAxMjggNjRaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                }}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
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

const WithdrawalRequestsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);
  const [modalType, setModalType] = useState<'approve' | 'reject' | 'view'>('approve');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCodeModal, setQrCodeModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
  }>({
    isOpen: false,
    imageUrl: ''
  });

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

  const handleViewQRCode = (imageUrl: string) => {
    setQrCodeModal({
      isOpen: true,
      imageUrl
    });
  };

  const closeQRCodeModal = () => {
    setQrCodeModal({
      isOpen: false,
      imageUrl: ''
    });
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
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Total Requests</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{totalRequests}</p>
            </div>
            <div className="bg-sky-500 rounded-full p-2 sm:p-3 ml-3 flex-shrink-0">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Total Amount</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">${totalAmount.toLocaleString()}</p>
            </div>
            <div className="bg-green-500 rounded-full p-2 sm:p-3 ml-3 flex-shrink-0">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Pending</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{pendingCount}</p>
            </div>
            <div className="bg-orange-500 rounded-full p-2 sm:p-3 ml-3 flex-shrink-0">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600">Approved</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="bg-purple-500 rounded-full p-2 sm:p-3 ml-3 flex-shrink-0">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Withdrawal Requests</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
                className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <button
              onClick={() => fetchRequests()}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <MobileTable
          data={filteredRequests.map(request => ({
            ...request,
            user: (
              <div>
                <span className="font-medium text-gray-800">{request.userName}</span>
                <br />
                <span className="text-sm text-gray-500">{request.userEmail}</span>
              </div>
            ),
            amount: `$${request.amount.toLocaleString()}`,
            walletAddress: (
              <span className="font-mono text-sm">{request.walletAddress.slice(0, 10)}...</span>
            ),
            walletType: request.walletType.charAt(0).toUpperCase() + request.walletType.slice(1),
            date: formatDate(request.createdAt),
            status: request.status,
            actions: (
              <div className="flex items-center space-x-2">
                <button 
                  className="text-blue-600 hover:text-blue-800 p-1"
                  title="View Details"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(request);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </button>
                {request.status === 'pending' && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(request);
                      }}
                      className="text-green-600 hover:text-green-800 p-1"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(request);
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            )
          }))}
          columns={[
            { key: 'user', label: 'User', mobilePriority: true },
            { key: 'amount', label: 'Amount', mobilePriority: true },
            { key: 'walletAddress', label: 'Wallet Address' },
            { key: 'walletType', label: 'Wallet Type' },
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status', mobilePriority: true },
            { key: 'actions', label: 'Actions' }
          ]}
          onRowClick={handleView}
          emptyMessage="No withdrawal requests found"
          loading={loading}
        />
      </div>

      <WithdrawalRequestModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        type={modalType}
        onViewQRCode={handleViewQRCode}
      />

      <QRCodeModal
        imageUrl={qrCodeModal.imageUrl}
        isOpen={qrCodeModal.isOpen}
        onClose={closeQRCodeModal}
      />
    </div>
  );
};

export default WithdrawalRequestsPage;