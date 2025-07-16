import React, { useState, useEffect } from 'react';
import { TrendingUp, PlusCircle, Filter, BarChart3, Edit, Trash2, Eye, RefreshCw, X as CloseIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import { apiClient, InvestmentPlan, UserInvestment } from '../../services/api';
import { toast } from 'react-hot-toast';

interface InvestmentPlanModalProps {
  plan: InvestmentPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const InvestmentPlanModal: React.FC<InvestmentPlanModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    investmentRequired: '',
    dailyPercentage: '',
    durationDays: '',
    totalReturnPercentage: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title,
        description: plan.description,
        investmentRequired: plan.investmentRequired.toString(),
        dailyPercentage: plan.dailyPercentage.toString(),
        durationDays: plan.durationDays.toString(),
        totalReturnPercentage: plan.totalReturnPercentage.toString(),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        investmentRequired: '',
        dailyPercentage: '',
        durationDays: '',
        totalReturnPercentage: '',
      });
    }
    setImage(null);
  }, [plan]);

  const handleSubmit = async () => {
    // Validate all required fields
    if (!formData.title.trim()) {
      toast.error('Please enter a plan title');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a plan description');
      return;
    }
    if (!formData.investmentRequired || Number(formData.investmentRequired) <= 0) {
      toast.error('Please enter a valid investment amount');
      return;
    }
    if (!formData.dailyPercentage || Number(formData.dailyPercentage) <= 0) {
      toast.error('Please enter a valid daily percentage');
      return;
    }
    if (!formData.durationDays || Number(formData.durationDays) <= 0) {
      toast.error('Please enter a valid duration in days');
      return;
    }
    if (!formData.totalReturnPercentage || Number(formData.totalReturnPercentage) <= 0) {
      toast.error('Please enter a valid total return percentage');
      return;
    }

    // For new plans, image is required
    if (!plan && !image) {
      toast.error('Please select an image for the investment plan');
      return;
    }

    try {
      setLoading(true);
      
      if (plan) {
        // Update existing plan
        const updateData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          investmentRequired: Number(formData.investmentRequired),
          dailyPercentage: Number(formData.dailyPercentage),
          durationDays: Number(formData.durationDays),
          totalReturnPercentage: Number(formData.totalReturnPercentage),
          image: image || undefined,
        };
        await apiClient.updateInvestmentPlan(plan._id, updateData);
        toast.success('Investment plan updated successfully');
      } else {
        // Create new plan
        const createData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          investmentRequired: Number(formData.investmentRequired),
          dailyPercentage: Number(formData.dailyPercentage),
          durationDays: Number(formData.durationDays),
          totalReturnPercentage: Number(formData.totalReturnPercentage),
          image: image!,
        };
        await apiClient.createInvestmentPlan(createData);
        toast.success('Investment plan created successfully');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving investment plan:', error);
      toast.error('Failed to save investment plan');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      investmentRequired: '',
      dailyPercentage: '',
      durationDays: '',
      totalReturnPercentage: '',
    });
    setImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {plan ? 'Edit Investment Plan' : 'Create Investment Plan'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Enter plan title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Required ($) *
                </label>
                <input
                  type="number"
                  value={formData.investmentRequired}
                  onChange={(e) => setFormData({ ...formData, investmentRequired: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Enter investment amount"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                placeholder="Enter plan description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Percentage (%) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.dailyPercentage}
                  onChange={(e) => setFormData({ ...formData, dailyPercentage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="e.g., 2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Days) *
                </label>
                <input
                  type="number"
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="e.g., 30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Return (%) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.totalReturnPercentage}
                  onChange={(e) => setFormData({ ...formData, totalReturnPercentage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="e.g., 75"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan Image {!plan && '*'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
              {plan && plan.image && (
                <p className="text-sm text-gray-500 mt-1">
                  Current image: {plan.image}
                </p>
              )}
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
              disabled={loading}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                plan ? 'Update Plan' : 'Create Plan'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InvestmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'investments'>('plans');
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [plansResponse, investmentsResponse] = await Promise.all([
        apiClient.getInvestmentPlans(),
        apiClient.getUserInvestments()
      ]);

      if (plansResponse.success) {
        setPlans(plansResponse.data);
      }

      if (investmentsResponse.success) {
        setUserInvestments(investmentsResponse.data);
      }

      toast.success('Investment data loaded successfully');
    } catch (err) {
      console.error('Error fetching investment data:', err);
      setError('Failed to load investment data');
      toast.error('Failed to load investment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTogglePlan = async (planId: string) => {
    try {
      const response = await apiClient.toggleInvestmentPlan(planId);
      if (response.success) {
        toast.success('Plan status updated successfully');
        fetchData();
      } else {
        toast.error('Failed to update plan status');
      }
    } catch (error) {
      console.error('Error toggling plan:', error);
      toast.error('Failed to update plan status');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this investment plan?')) return;

    try {
      const response = await apiClient.deleteInvestmentPlan(planId);
      if (response.success) {
        toast.success('Investment plan deleted successfully');
        fetchData();
      } else {
        toast.error('Failed to delete investment plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete investment plan');
    }
  };

  const handleModalSuccess = () => {
    fetchData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getInvestmentStatusColor = (investment: UserInvestment) => {
    if (investment.isCompleted) return 'bg-green-100 text-green-800';
    if (investment.isWithdrawn) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getInvestmentStatusText = (investment: UserInvestment) => {
    if (investment.isCompleted) return 'Completed';
    if (investment.isWithdrawn) return 'Withdrawn';
    return 'Active';
  };

  const stats = {
    totalPlans: plans.length,
    activePlans: plans.filter(plan => plan.isActive).length,
    totalInvestments: userInvestments.length,
    activeInvestments: userInvestments.filter(inv => !inv.isCompleted && !inv.isWithdrawn).length,
    totalInvested: userInvestments.reduce((sum, inv) => sum + inv.investmentAmount, 0),
    totalEarned: userInvestments.reduce((sum, inv) => sum + inv.totalEarned, 0)
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-500" />
            <span className="text-gray-600">Loading investment data...</span>
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
              onClick={fetchData}
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
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalPlans}</p>
            </div>
            <div className="bg-sky-500 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Plans</p>
              <p className="text-2xl font-bold text-green-600">{stats.activePlans}</p>
            </div>
            <div className="bg-green-500 rounded-full p-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-800">${stats.totalInvested.toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalEarned.toLocaleString()}</p>
            </div>
            <div className="bg-orange-500 rounded-full p-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'plans'
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Investment Plans
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'investments'
                  ? 'bg-sky-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              User Investments
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {activeTab === 'plans' && (
              <button
                onClick={() => {
                  setSelectedPlan(null);
                  setIsModalOpen(true);
                }}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Plan</span>
              </button>
            )}
            <button
              onClick={fetchData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Investment Plans Tab */}
        {activeTab === 'plans' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-700">Plan</th>
                  <th className="text-left p-4 font-medium text-gray-700">Investment Required</th>
                  <th className="text-left p-4 font-medium text-gray-700">Daily Return</th>
                  <th className="text-left p-4 font-medium text-gray-700">Duration</th>
                  <th className="text-left p-4 font-medium text-gray-700">Total Return</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No investment plans found
                    </td>
                  </tr>
                ) : (
                  plans.map((plan) => (
                    <tr key={plan._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <span className="font-medium text-gray-800">{plan.title}</span>
                          <br />
                          <span className="text-sm text-gray-500">{plan.description}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">${plan.investmentRequired.toLocaleString()}</td>
                      <td className="p-4 text-gray-600">{plan.dailyPercentage}%</td>
                      <td className="p-4 text-gray-600">{plan.durationDays} days</td>
                      <td className="p-4 text-gray-600">{plan.totalReturnPercentage}%</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.isActive)}`}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleTogglePlan(plan._id)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title={plan.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {plan.isActive ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPlan(plan);
                              setIsModalOpen(true);
                            }}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan._id)}
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
        )}

        {/* User Investments Tab */}
        {activeTab === 'investments' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-medium text-gray-700">User</th>
                  <th className="text-left p-4 font-medium text-gray-700">Plan</th>
                  <th className="text-left p-4 font-medium text-gray-700">Investment Amount</th>
                  <th className="text-left p-4 font-medium text-gray-700">Daily Earning</th>
                  <th className="text-left p-4 font-medium text-gray-700">Total Earned</th>
                  <th className="text-left p-4 font-medium text-gray-700">Remaining Days</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {userInvestments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No user investments found
                    </td>
                  </tr>
                ) : (
                  userInvestments.map((investment) => (
                    <tr key={investment._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <span className="font-medium text-gray-800">{investment.userId.name}</span>
                          <br />
                          <span className="text-sm text-gray-500">{investment.userId.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{investment.planId.title}</td>
                      <td className="p-4 text-gray-600">${investment.investmentAmount.toLocaleString()}</td>
                      <td className="p-4 text-gray-600">${investment.dailyEarning.toLocaleString()}</td>
                      <td className="p-4 text-gray-600">${investment.totalEarned.toLocaleString()}</td>
                      <td className="p-4 text-gray-600">{investment.remainingDays} days</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvestmentStatusColor(investment)}`}>
                          {getInvestmentStatusText(investment)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <InvestmentPlanModal
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default InvestmentPage;