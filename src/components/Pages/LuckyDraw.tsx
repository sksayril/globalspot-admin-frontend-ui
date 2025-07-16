import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  DollarSign, 
  Calendar, 
  Award,
  Eye,
  UserPlus,
  UserMinus,
  Shuffle,
  BarChart3,
  X,
  Check,
  AlertCircle,
  Clock,
  Star
} from 'lucide-react';
import { apiClient } from '../../services/api';
import { 
  LuckyDraw, 
  LuckyDrawDetail, 
  LuckyDrawParticipant, 
  LuckyDrawWinner,
  LuckyDrawStats,
  CreateLuckyDrawRequest,
  UpdateLuckyDrawRequest,
  AddUsersToLuckyDrawRequest,
  RemoveUsersFromLuckyDrawRequest
} from '../../services/api';

const LuckyDrawPage: React.FC = () => {
  const [luckyDraws, setLuckyDraws] = useState<LuckyDraw[]>([]);
  const [selectedLuckyDraw, setSelectedLuckyDraw] = useState<LuckyDrawDetail | null>(null);
  const [stats, setStats] = useState<LuckyDrawStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddUsersModal, setShowAddUsersModal] = useState(false);
  const [showRemoveUsersModal, setShowRemoveUsersModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  // Form states
  const [formData, setFormData] = useState<CreateLuckyDrawRequest>({
    title: '',
    description: '',
    amount: 0,
    maxParticipants: 0,
    startDate: '',
    endDate: '',
    drawDate: ''
  });

  useEffect(() => {
    fetchLuckyDraws();
  }, [currentPage]);

  const fetchLuckyDraws = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getLuckyDraws(currentPage, 10);
      if (response.success) {
        setLuckyDraws(response.data.luckyDraws);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Error fetching lucky draws:', err);
      setError('Failed to load lucky draws. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLuckyDraw = async () => {
    try {
      setLoading(true);
      const response = await apiClient.createLuckyDraw(formData);
      if (response.success) {
        setShowCreateModal(false);
        setFormData({
          title: '',
          description: '',
          amount: 0,
          maxParticipants: 0,
          startDate: '',
          endDate: '',
          drawDate: ''
        });
        fetchLuckyDraws();
      }
    } catch (err) {
      console.error('Error creating lucky draw:', err);
      setError('Failed to create lucky draw. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLuckyDraw = async (luckyDrawId: string, data: UpdateLuckyDrawRequest) => {
    try {
      setLoading(true);
      const response = await apiClient.updateLuckyDraw(luckyDrawId, data);
      if (response.success) {
        setShowEditModal(false);
        fetchLuckyDraws();
      }
    } catch (err) {
      console.error('Error updating lucky draw:', err);
      setError('Failed to update lucky draw. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLuckyDraw = async (luckyDrawId: string) => {
    if (!window.confirm('Are you sure you want to delete this lucky draw?')) return;
    
    try {
      setLoading(true);
      const response = await apiClient.deleteLuckyDraw(luckyDrawId);
      if (response.success) {
        fetchLuckyDraws();
      }
    } catch (err) {
      console.error('Error deleting lucky draw:', err);
      setError('Failed to delete lucky draw. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (luckyDrawId: string) => {
    try {
      setLoading(true);
      const response = await apiClient.getLuckyDrawDetails(luckyDrawId);
      if (response.success) {
        setSelectedLuckyDraw(response.data);
        setShowDetailsModal(true);
      }
    } catch (err) {
      console.error('Error fetching lucky draw details:', err);
      setError('Failed to load lucky draw details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStats = async (luckyDrawId: string) => {
    try {
      setLoading(true);
      const response = await apiClient.getLuckyDrawStats(luckyDrawId);
      if (response.success) {
        setStats(response.data);
        setShowStatsModal(true);
      }
    } catch (err) {
      console.error('Error fetching lucky draw stats:', err);
      setError('Failed to load lucky draw statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUsers = async (luckyDrawId: string) => {
    try {
      setLoading(true);
      const data: AddUsersToLuckyDrawRequest = { userIds: selectedUserIds };
      const response = await apiClient.addUsersToLuckyDraw(luckyDrawId, data);
      if (response.success) {
        setShowAddUsersModal(false);
        setSelectedUserIds([]);
        handleViewDetails(luckyDrawId);
      }
    } catch (err) {
      console.error('Error adding users to lucky draw:', err);
      setError('Failed to add users to lucky draw. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUsers = async (luckyDrawId: string) => {
    try {
      setLoading(true);
      const data: RemoveUsersFromLuckyDrawRequest = { userIds: selectedUserIds };
      const response = await apiClient.removeUsersFromLuckyDraw(luckyDrawId, data);
      if (response.success) {
        setShowRemoveUsersModal(false);
        setSelectedUserIds([]);
        handleViewDetails(luckyDrawId);
      }
    } catch (err) {
      console.error('Error removing users from lucky draw:', err);
      setError('Failed to remove users from lucky draw. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrawWinners = async (luckyDrawId: string) => {
    if (!window.confirm('Are you sure you want to draw winners? This action cannot be undone.')) return;
    
    try {
      setLoading(true);
      const response = await apiClient.drawWinners(luckyDrawId);
      if (response.success) {
        handleViewDetails(luckyDrawId);
      }
    } catch (err) {
      console.error('Error drawing winners:', err);
      setError('Failed to draw winners. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lucky Draw Management</h1>
          <p className="text-gray-600">Create and manage lucky draws for users</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Lucky Draw</span>
        </button>
      </div>

      {/* Lucky Draws List */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">All Lucky Draws</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lucky Draw
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prize Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {luckyDraws.map((luckyDraw) => (
                <tr key={luckyDraw._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{luckyDraw.title}</div>
                      <div className="text-sm text-gray-500">{luckyDraw.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600">
                      {formatCurrency(luckyDraw.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {luckyDraw.currentParticipants} / {luckyDraw.maxParticipants}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(luckyDraw.status)}`}>
                      {luckyDraw.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Start: {formatDate(luckyDraw.startDate)}</div>
                    <div>End: {formatDate(luckyDraw.endDate)}</div>
                    <div>Draw: {formatDate(luckyDraw.drawDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(luckyDraw._id)}
                        className="text-sky-600 hover:text-sky-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewStats(luckyDraw._id)}
                        className="text-purple-600 hover:text-purple-900"
                        title="View Stats"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLuckyDraw(luckyDraw._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Lucky Draw Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Lucky Draw</h3>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prize Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Participants</label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Draw Date</label>
                  <input
                    type="datetime-local"
                    value={formData.drawDate}
                    onChange={(e) => setFormData({ ...formData, drawDate: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLuckyDraw}
                className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium hover:bg-sky-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lucky Draw Details Modal */}
      {showDetailsModal && selectedLuckyDraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedLuckyDraw.title}</h3>
              <button onClick={() => setShowDetailsModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lucky Draw Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Lucky Draw Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Description:</span> {selectedLuckyDraw.description}</div>
                    <div><span className="font-medium">Prize Amount:</span> {formatCurrency(selectedLuckyDraw.amount)}</div>
                    <div><span className="font-medium">Participants:</span> {selectedLuckyDraw.currentParticipants} / {selectedLuckyDraw.maxParticipants}</div>
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLuckyDraw.status)}`}>
                        {selectedLuckyDraw.status}
                      </span>
                    </div>
                    <div><span className="font-medium">Start Date:</span> {formatDateTime(selectedLuckyDraw.startDate)}</div>
                    <div><span className="font-medium">End Date:</span> {formatDateTime(selectedLuckyDraw.endDate)}</div>
                    <div><span className="font-medium">Draw Date:</span> {formatDateTime(selectedLuckyDraw.drawDate)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowAddUsersModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Users</span>
                  </button>
                  <button
                    onClick={() => setShowRemoveUsersModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    <UserMinus className="w-4 h-4" />
                    <span>Remove Users</span>
                  </button>
                  {selectedLuckyDraw.status === 'active' && (
                    <button
                      onClick={() => handleDrawWinners(selectedLuckyDraw._id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
                    >
                      <Shuffle className="w-4 h-4" />
                      <span>Draw Winners</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Participants ({selectedLuckyDraw.participants.length})</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedLuckyDraw.participants.map((participant) => (
                      <div key={participant.userId._id} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <div className="font-medium">{participant.userName}</div>
                          <div className="text-sm text-gray-500">{participant.userEmail}</div>
                          <div className="text-xs text-gray-400">{formatDateTime(participant.joinedAt)}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {participant.isWinner && (
                            <Award className="w-4 h-4 text-yellow-500" />
                          )}
                          {participant.hasClaimed && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Winners */}
                {selectedLuckyDraw.winners.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Winners ({selectedLuckyDraw.winners.length})</h4>
                    <div className="space-y-2">
                      {selectedLuckyDraw.winners.map((winner) => (
                        <div key={winner.userId} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div>
                            <div className="font-medium">{winner.userName}</div>
                            <div className="text-sm text-gray-500">{winner.userEmail}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-green-600">
                              {formatCurrency(winner.amount)}
                            </span>
                            {winner.hasClaimed ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && stats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Lucky Draw Statistics</h3>
              <button onClick={() => setShowStatsModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.totalParticipants}</div>
                <div className="text-sm text-blue-600">Total Participants</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{stats.totalWinners}</div>
                <div className="text-sm text-green-600">Total Winners</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalPrize)}</div>
                <div className="text-sm text-purple-600">Total Prize</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{stats.participationRate}%</div>
                <div className="text-sm text-yellow-600">Participation Rate</div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Claimed Prizes:</span>
                <span className="text-green-600 font-semibold">{stats.claimedPrizes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Unclaimed Prizes:</span>
                <span className="text-red-600 font-semibold">{stats.unclaimedPrizes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Max Participants:</span>
                <span className="text-gray-600">{stats.maxParticipants}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyDrawPage; 