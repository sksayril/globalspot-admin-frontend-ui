import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Users, DollarSign } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { TopUser } from '../../services/api';

const TopUsers: React.FC = () => {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [rankingType, setRankingType] = useState<'investment' | 'referral' | 'deposit'>('investment');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopUsers = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getTopUsers(rankingType);
        if (data) {
          setTopUsers(data.topUsers);
        }
      } catch (error) {
        console.error('Error fetching top users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, [rankingType]);

  const getRankingIcon = (type: string) => {
    switch (type) {
      case 'investment':
        return <TrendingUp className="w-5 h-5" />;
      case 'referral':
        return <Users className="w-5 h-5" />;
      case 'deposit':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  const getRankingTitle = (type: string) => {
    switch (type) {
      case 'investment':
        return 'Top Investors';
      case 'referral':
        return 'Top Referrers';
      case 'deposit':
        return 'Top Depositors';
      default:
        return 'Top Performers';
    }
  };

  const getRankingMetric = (user: TopUser, type: string) => {
    switch (type) {
      case 'investment':
        return user.totalInvestment ? `$${user.totalInvestment.toLocaleString()}` : 'N/A';
      case 'referral':
        return user.totalReferrals ? `${user.totalReferrals} referrals` : 'N/A';
      case 'deposit':
        return user.totalDeposits ? `$${user.totalDeposits.toLocaleString()}` : 'N/A';
      default:
        return 'N/A';
    }
  };

  const getSecondaryMetric = (user: TopUser, type: string) => {
    switch (type) {
      case 'investment':
        return user.totalEarned ? `Earned: $${user.totalEarned.toLocaleString()}` : '';
      case 'referral':
        return user.totalReferrals ? `${user.totalReferrals} total referrals` : '';
      case 'deposit':
        return user.totalDeposits ? `$${user.totalDeposits.toLocaleString()} total` : '';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {getRankingIcon(rankingType)}
          <h3 className="text-lg font-semibold text-gray-800">{getRankingTitle(rankingType)}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={rankingType}
            onChange={(e) => setRankingType(e.target.value as 'investment' | 'referral' | 'deposit')}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="investment">Investment</option>
            <option value="referral">Referral</option>
            <option value="deposit">Deposit</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                index === 0 ? 'bg-yellow-500' :
                index === 1 ? 'bg-gray-400' :
                index === 2 ? 'bg-orange-500' : 'bg-sky-500'
              }`}>
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                {getSecondaryMetric(user, rankingType) && (
                  <p className="text-xs text-gray-400">{getSecondaryMetric(user, rankingType)}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{getRankingMetric(user, rankingType)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && topUsers.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};

export default TopUsers; 