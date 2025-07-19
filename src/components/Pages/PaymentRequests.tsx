import React, { useState, useEffect } from 'react';
import { CreditCard, Filter, Check, X, Eye, RefreshCw, X as CloseIcon, AlertCircle, Plus, Upload, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { apiClient, DepositRequest, ApproveDepositRequest, Content, CreateContentRequest, UpdateContentRequest } from '../../services/api';
import { contentService } from '../../services/contentService';
import { toast } from 'react-hot-toast';

interface DepositDetailModalProps {
  deposit: DepositRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ApproveRejectModalProps {
  deposit: DepositRequest | null;
  action: 'approve' | 'reject';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ContentModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ContentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (content: Content) => void;
  onDelete: (contentId: string) => void;
}

const ApproveRejectModal: React.FC<ApproveRejectModalProps> = ({ 
  deposit, 
  action, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!deposit) return;

    try {
      setLoading(true);
      const data: ApproveDepositRequest = {
        status: action === 'approve' ? 'approved' : 'rejected',
        adminNotes: adminNotes.trim()
      };

      const response = await apiClient.approveDepositRequest(deposit._id, data);
      
      if (response.success) {
        toast.success(`Payment request ${action}d successfully`);
        onSuccess();
        onClose();
      } else {
        toast.error(`Failed to ${action} payment request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing deposit:`, error);
      toast.error(`Failed to ${action} payment request`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAdminNotes('');
    onClose();
  };

  if (!isOpen || !deposit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {action === 'approve' ? 'Approve' : 'Reject'} Payment Request
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
              <h3 className="font-semibold text-gray-800 mb-2">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">User:</span>
                  <span className="font-medium text-gray-800 ml-2">{deposit.user.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-gray-800 ml-2">${deposit.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-800 ml-2 capitalize">{deposit.paymentMethod}</span>
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
                placeholder={`Enter reason for ${action}ing this payment request...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                rows={4}
                required
              />
            </div>

            {action === 'reject' && (
              <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  Rejecting this payment request will notify the user and they may need to submit a new request.
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

const ContentModal: React.FC<ContentModalProps> = ({ content, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    textData: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title,
        textData: content.textData,
      });
      setImagePreview(content.imageUrl);
    } else {
      setFormData({
        title: '',
        textData: '',
      });
      setImage(null);
      setImagePreview('');
    }
  }, [content]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.textData.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!content && !image) {
      toast.error('Please select an image');
      return;
    }

    try {
      setLoading(true);
      
      if (content) {
        // Update existing content
        const updateData: UpdateContentRequest = {
          title: formData.title.trim(),
          textData: formData.textData.trim(),
          image: image || undefined,
        };
        await contentService.updateContent(content._id, updateData);
        toast.success('Content updated successfully');
      } else {
        // Create new content
        const createData: CreateContentRequest = {
          title: formData.title.trim(),
          textData: formData.textData.trim(),
          image: image!,
        };
        await contentService.uploadContent(createData);
        toast.success('Content uploaded successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      textData: '',
    });
    setImage(null);
    setImagePreview('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {content ? 'Edit Content' : 'Upload New Content'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter content title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>

            {/* Text Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Content *
              </label>
              <textarea
                value={formData.textData}
                onChange={(e) => setFormData({ ...formData, textData: e.target.value })}
                placeholder="Enter text content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                rows={6}
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image {!content && '*'}
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                
                {imagePreview && (
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-contain bg-gray-100"
                    />
                  </div>
                )}
              </div>
            </div>
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
              disabled={loading || !formData.title.trim() || !formData.textData.trim() || (!content && !image)}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{content ? 'Updating...' : 'Uploading...'}</span>
                </div>
              ) : (
                content ? 'Update Content' : 'Upload Content'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentListModal: React.FC<ContentListModalProps> = ({ isOpen, onClose, onEdit, onDelete }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchContents = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await contentService.getContentList(page, 10);
      if (response.success && response.data) {
        setContents(response.data.contents);
        setTotalPages(response.data.pagination.pages);
        setCurrentPage(response.data.pagination.page);
      } else {
        toast.error('Failed to load content');
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchContents();
    }
  }, [isOpen]);

  const handleDelete = async (contentId: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        const response = await contentService.deleteContent(contentId);
        if (response.success) {
          toast.success('Content deleted successfully');
          fetchContents(currentPage);
        } else {
          toast.error('Failed to delete content');
        }
      } catch (error) {
        console.error('Error deleting content:', error);
        toast.error('Failed to delete content');
      }
    }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Content Management</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
                <span className="text-gray-600">Loading content...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4 font-medium text-gray-700">Image</th>
                      <th className="text-left p-4 font-medium text-gray-700">Title</th>
                      <th className="text-left p-4 font-medium text-gray-700">Status</th>
                      <th className="text-left p-4 font-medium text-gray-700">Created</th>
                      <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-500">
                          No content found
                        </td>
                      </tr>
                    ) : (
                      contents.map((content) => (
                        <tr key={content._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-4">
                            <div className="w-16 h-16 border rounded-lg overflow-hidden">
                              <img
                                src={`https://api.goalsbot.com${content.imageUrl}`}
                                alt={content.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEMyNCAyMS43OTA5IDI1Ljc5MDkgMjAgMjggMjBDMzAuMjA5MSAyMCAzMiAyMS43OTA5IDMyIDI0QzMyIDI2LjIwOTEgMzAuMjA5MSAyOCAyOCAyOEMyNS43OTA5IDI4IDI0IDI2LjIwOTEgMjQgMjRaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNiA0NEMxNiAzOS41ODE3IDE5LjU4MTcgMzYgMjQgMzZINDBDNDQuNDE4MyAzNiA0OCAzOS41ODE3IDQ4IDQ0VjQ4SDE2VjQ0WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                }}
                              />
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <span className="font-medium text-gray-800">{content.title}</span>
                              <br />
                              <span className="text-sm text-gray-500 line-clamp-2">
                                {content.textData.substring(0, 100)}...
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              content.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {content.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">{formatDate(content.createdAt)}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => onEdit(content)}
                                className="text-blue-600 hover:text-blue-800 p-1" 
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(content._id)}
                                className="text-red-600 hover:text-red-800 p-1" 
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
                      onClick={() => fetchContents(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchContents(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const DepositDetailModal: React.FC<DepositDetailModalProps> = ({ deposit, isOpen, onClose }) => {
  if (!isOpen || !deposit) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (imagePath: string) => {
    // Normalize the path by replacing backslashes with forward slashes
    const normalizedPath = imagePath.replace(/\\/g, '/');
    return `https://api.goalsbot.com/${normalizedPath}`;
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Payment Request Details</h2>
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
                  <p className="font-medium text-gray-800">{deposit.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">{deposit.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-800">{deposit.user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-medium text-gray-800 font-mono text-sm">{deposit.user._id}</p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold text-gray-800 text-lg">${deposit.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium text-gray-800 capitalize">{deposit.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment ID</p>
                  <p className="font-medium text-gray-800 font-mono text-sm">{deposit.paymentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wallet Type</p>
                  <p className="font-medium text-gray-800 capitalize">{deposit.walletType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deposit.status)}`}>
                    {deposit.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Request ID</p>
                  <p className="font-medium text-gray-800 font-mono text-sm">{deposit._id}</p>
                </div>
              </div>
            </div>

            {/* Payment Proof */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Payment Proof</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Proof File</p>
                  <p className="font-medium text-gray-800 font-mono text-sm break-all">{deposit.paymentProof}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Proof Image</p>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={getImageUrl(deposit.paymentProof)}
                      alt="Payment Proof"
                      className="w-full h-64 object-contain bg-gray-100"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCAxMDBDNjAgODkuNTQ0NyA2OC4wMDAxIDgxLjUgNzguNSAxMDBDNjguMDAwMSAxMTguNSA2MCAxMTAuNDU1IDYwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEwMCAxMDBDMTEwLjQ1NSAxMDAgMTE4LjUgOTEuOTk5OSAxMDAgMTAwQzgxLjUgMTAwIDg5LjU0NDcgMTA4LjA0NSAxMDAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDE0MEM5MS45OTk5IDE0MCA4OS41NDQ3IDEzMS45NTUgMTAwIDEyMEMxMTAuNDU1IDEyMCAxMTguNSAxMjguMDAwMSAxMDAgMTQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTAwIDYwQzEwOC4wNDUgNjAgMTEwLjQ1NSA2OC4wMDAxIDEwMCA3OEM5MS45OTk5IDc4IDg5LjU0NDcgNjguMDAwMSAxMDAgNjBaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Information */}
            {deposit.status === 'approved' && deposit.approvedBy && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Approval Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Approved By</p>
                    <p className="font-medium text-gray-800">{deposit.approvedBy.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Approved At</p>
                    <p className="font-medium text-gray-800">{formatDate(deposit.approvedAt!)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Admin Notes</p>
                    <p className="font-medium text-gray-800">{deposit.adminNotes || 'No notes provided'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Timestamps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="font-medium text-gray-800">{formatDate(deposit.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Updated At</p>
                  <p className="font-medium text-gray-800">{formatDate(deposit.updatedAt)}</p>
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

const PaymentRequestsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeposit, setSelectedDeposit] = useState<DepositRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approveRejectModal, setApproveRejectModal] = useState<{
    isOpen: boolean;
    deposit: DepositRequest | null;
    action: 'approve' | 'reject';
  }>({
    isOpen: false,
    deposit: null,
    action: 'approve'
  });

  // Content management state
  const [contentModal, setContentModal] = useState<{
    isOpen: boolean;
    content: Content | null;
  }>({
    isOpen: false,
    content: null
  });
  const [contentListModal, setContentListModal] = useState(false);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getDeposits();
      if (response.success) {
        setDeposits(response.data);
        toast.success('Payment requests loaded successfully');
      } else {
        setError('Failed to load payment requests');
        toast.error('Failed to load payment requests');
      }
    } catch (err) {
      console.error('Error fetching deposits:', err);
      setError('Failed to load payment requests');
      toast.error('Failed to load payment requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const filteredDeposits = deposits.filter(deposit => 
    filterStatus === 'all' || deposit.status === filterStatus
  );

  const totalAmount = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
  const pendingCount = deposits.filter(deposit => deposit.status === 'pending').length;
  const approvedCount = deposits.filter(deposit => deposit.status === 'approved').length;

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

  const handleViewDetails = (deposit: DepositRequest) => {
    setSelectedDeposit(deposit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDeposit(null);
  };

  const handleApproveReject = (deposit: DepositRequest, action: 'approve' | 'reject') => {
    setApproveRejectModal({
      isOpen: true,
      deposit,
      action
    });
  };

  const closeApproveRejectModal = () => {
    setApproveRejectModal({
      isOpen: false,
      deposit: null,
      action: 'approve'
    });
  };

  const handleApproveRejectSuccess = () => {
    fetchDeposits(); // Refresh the data
  };

  // Content management handlers
  const handleOpenContentModal = (content: Content | null = null) => {
    setContentModal({
      isOpen: true,
      content
    });
  };

  const handleCloseContentModal = () => {
    setContentModal({
      isOpen: false,
      content: null
    });
  };

  const handleContentSuccess = () => {
    // Refresh content list if needed
    if (contentListModal) {
      // The ContentListModal will handle its own refresh
    }
  };

  const handleEditContent = (content: Content) => {
    setContentListModal(false);
    handleOpenContentModal(content);
  };

  const handleDeleteContent = (contentId: string) => {
    // The ContentListModal will handle the delete operation
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
            <span className="text-gray-600">Loading payment requests...</span>
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
              onClick={fetchDeposits}
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
              <p className="text-2xl font-bold text-gray-800">{deposits.length}</p>
            </div>
            <div className="bg-sky-500 rounded-full p-3">
              <CreditCard className="w-6 h-6 text-white" />
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
              <CreditCard className="w-6 h-6 text-white" />
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
              <CreditCard className="w-6 h-6 text-white" />
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
          <h2 className="text-xl font-semibold text-gray-800">Payment Requests</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setContentListModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Content Management</span>
            </button>
            <button
              onClick={() => handleOpenContentModal()}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Content</span>
            </button>
            <button
              onClick={fetchDeposits}
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
                <th className="text-left p-4 font-medium text-gray-700">Amount</th>
                <th className="text-left p-4 font-medium text-gray-700">Payment Method</th>
                <th className="text-left p-4 font-medium text-gray-700">Payment ID</th>
                <th className="text-left p-4 font-medium text-gray-700">Wallet Type</th>
                <th className="text-left p-4 font-medium text-gray-700">Date</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No payment requests found
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((deposit) => (
                  <tr key={deposit._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <span className="font-medium text-gray-800">{deposit.user.name}</span>
                        <br />
                        <span className="text-sm text-gray-500">{deposit.user.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-gray-800">${deposit.amount.toLocaleString()}</span>
                    </td>
                    <td className="p-4 text-gray-600 capitalize">{deposit.paymentMethod}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{deposit.paymentId}</td>
                    <td className="p-4 text-gray-600 capitalize">{deposit.walletType}</td>
                    <td className="p-4 text-gray-600">{formatDate(deposit.createdAt)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deposit.status)}`}>
                        {deposit.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(deposit)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {deposit.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApproveReject(deposit, 'approve')}
                              className="text-green-600 hover:text-green-800 p-1" 
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleApproveReject(deposit, 'reject')}
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

      <DepositDetailModal
        deposit={selectedDeposit}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      <ApproveRejectModal
        deposit={approveRejectModal.deposit}
        action={approveRejectModal.action}
        isOpen={approveRejectModal.isOpen}
        onClose={closeApproveRejectModal}
        onSuccess={handleApproveRejectSuccess}
      />

      <ContentModal
        content={contentModal.content}
        isOpen={contentModal.isOpen}
        onClose={handleCloseContentModal}
        onSuccess={handleContentSuccess}
      />

      <ContentListModal
        isOpen={contentListModal}
        onClose={() => setContentListModal(false)}
        onEdit={handleEditContent}
        onDelete={handleDeleteContent}
      />
    </div>
  );
};

export default PaymentRequestsPage;