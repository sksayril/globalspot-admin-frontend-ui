const API_BASE_URL = 'https://7cvccltb-3100.inc1.devtunnels.ms';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminLoginResponse {
  admin: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  token: string;
}

// Dashboard Statistics Types
export interface DashboardStatistics {
  users: {
    total: number;
    active: number;
    blocked: number;
    newToday: number;
    newThisMonth: number;
    newThisYear: number;
    withReferrals: number;
  };
  revenue: {
    totalDeposits: number;
    totalWithdrawals: number;
    totalInvestments: number;
    totalInvestmentReturns: number;
    monthlyDeposits: number;
    monthlyWithdrawals: number;
    netRevenue: number;
    monthlyNetRevenue: number;
  };
  transactions: {
    pendingDeposits: number;
    pendingWithdrawals: number;
    totalReferralBonus: number;
  };
  investments: {
    active: number;
    completed: number;
    withdrawn: number;
  };
  wallets: {
    totalNormalBalance: number;
    totalInvestmentBalance: number;
  };
  userFlow: {
    dailyRegistrations: Array<{
      _id: string;
      count: number;
    }>;
  };
}

// User Management Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  originalPassword?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  isBlocked: boolean;
  referralCode: string;
  referredBy?: {
    _id: string;
    name: string;
    email: string;
    referralCode: string;
  };
  referralLevel: number;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  investmentWallet: {
    balance: number;
    transactions: Array<{
      type: string;
      amount: number;
      description: string;
      status: string;
      _id: string;
      date: string;
    }>;
  };
  normalWallet: {
    balance: number;
    transactions: Array<{
      type: string;
      amount: number;
      description: string;
      status: string;
      _id: string;
      date: string;
    }>;
  };
  dailyIncome: {
    lastClaimed: string | null;
    totalEarned: number;
    todayEarned: number;
  };
  firstDepositBonus: {
    hasReceived: boolean;
    amount: number;
    percentage: number;
    receivedAt: string | null;
  };
}

export interface AdminUsersResponse {
  success: boolean;
  data: User[];
}

export interface BlockUserResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    isBlocked: boolean;
  };
}

export interface RecentUsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Transaction Types
export interface Transaction {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  status: string;
  type: 'deposit' | 'withdrawal';
  createdAt: string;
}

export interface RecentTransactionsResponse {
  transactions: Transaction[];
  deposits: Transaction[];
  withdrawals: Transaction[];
}

// Analytics Types
export interface UserGrowthData {
  _id: string;
  count: number;
}

export interface UserGrowthResponse {
  period: number;
  growthData: UserGrowthData[];
}

export interface RevenueData {
  date: string;
  deposits: number;
  withdrawals: number;
  netRevenue: number;
}

export interface RevenueChartResponse {
  period: number;
  revenueData: RevenueData[];
}

export interface TopUser {
  name: string;
  email: string;
  totalInvestment?: number;
  totalEarned?: number;
  investmentCount?: number;
  totalReferrals?: number;
  totalDeposits?: number;
}

export interface TopUsersResponse {
  type: string;
  topUsers: TopUser[];
}

// Revenue Types
export interface RevenueOverview {
  totalRevenue: {
    deposits: number;
    withdrawals: number;
    investments: number;
    investmentReturns: number;
    netRevenue: number;
    profitMargin: string;
  };
  monthlyRevenue: {
    deposits: number;
    withdrawals: number;
    netRevenue: number;
    growthRate: string;
  };
  pendingAmounts: {
    deposits: number;
    withdrawals: number;
    total: number;
  };
  summary: {
    totalUsers: number;
    activeInvestments: number;
    completedInvestments: number;
    withdrawnInvestments: number;
  };
}

export interface RevenueOverviewResponse {
  success: boolean;
  data: RevenueOverview;
}

export interface RevenueDeposit {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  paymentProof: string;
  createdAt: string;
  approvedAt?: string;
}

export interface RevenueWithdrawal {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  walletAddress: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  transactionHash?: string;
}

export interface RevenueInvestment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  planId: {
    _id: string;
    title: string;
    dailyPercentage: number;
    durationDays: number;
  };
  investmentAmount: number;
  totalEarned: number;
  isCompleted: boolean;
  isWithdrawn: boolean;
  createdAt: string;
  endDate: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface DepositsSummary {
  totalAmount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface WithdrawalsSummary {
  totalAmount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface InvestmentsSummary {
  totalAmount: number;
  totalEarned: number;
  activeCount: number;
  completedCount: number;
  withdrawnCount: number;
}

export interface RevenueDepositsResponse {
  success: boolean;
  data: {
    deposits: RevenueDeposit[];
    pagination: PaginationInfo & { totalDeposits: number };
    summary: DepositsSummary;
  };
}

export interface WithdrawalsResponse {
  success: boolean;
  data: {
    withdrawals: RevenueWithdrawal[];
    pagination: PaginationInfo & { totalWithdrawals: number };
    summary: WithdrawalsSummary;
  };
}

export interface InvestmentsResponse {
  success: boolean;
  data: {
    investments: RevenueInvestment[];
    pagination: PaginationInfo & { totalInvestments: number };
    summary: InvestmentsSummary;
  };
}

export interface RevenueChartData {
  date: string;
  deposits: number;
  withdrawals: number;
  investments: number;
  netRevenue: number;
  depositCount: number;
  withdrawalCount: number;
  investmentCount: number;
}

export interface RevenueChartResponse {
  success: boolean;
  data: {
    period: number;
    revenueData: RevenueChartData[];
  };
}

export interface TopRevenueUser {
  name: string;
  email: string;
  phone: string;
  totalDeposits?: number;
  depositCount?: number;
  totalWithdrawals?: number;
  withdrawalCount?: number;
  totalInvestments?: number;
  investmentCount?: number;
}

export interface TopRevenueUsersResponse {
  success: boolean;
  data: {
    type: string;
    topUsers: TopRevenueUser[];
  };
}

export interface ExportDataResponse {
  success: boolean;
  data: {
    type: string;
    records: any[];
    totalRecords: number;
    exportDate: string;
  };
}

// Deposit Requests Types
export interface DepositRequest {
  _id: string;
  amount: number;
  paymentMethod: string;
  paymentId: string;
  paymentProof: string;
  walletType: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes: string;
  approvedBy?: {
    _id: string;
    name: string;
  };
  approvedAt?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DepositsResponse {
  success: boolean;
  data: DepositRequest[];
}

export interface ApproveDepositRequest {
  status: 'approved' | 'rejected';
  adminNotes: string;
}

export interface ApproveDepositResponse {
  success: boolean;
  message: string;
  data: DepositRequest;
}

// First Deposit Bonus Types
export interface FirstDepositBonus {
  hasReceived: boolean;
  amount: number;
  percentage: number;
  receivedAt: string | null;
}

export interface UserWithBonus {
  _id: string;
  name: string;
  email: string;
  firstDepositBonus: FirstDepositBonus;
  createdAt: string;
}

export interface FirstDepositBonusResponse {
  success: boolean;
  data: UserWithBonus[];
}

export interface UpdateBonusPercentageRequest {
  percentage: number;
}

export interface UpdateBonusPercentageResponse {
  success: boolean;
  message: string;
  data: {
    percentage: number;
    updatedAt: string;
  };
}

export interface GetBonusPercentageResponse {
  success: boolean;
  data: {
    percentage: number;
    updatedAt: string;
  };
}

// Investment Plan Types
export interface InvestmentPlan {
  _id: string;
  title: string;
  description: string;
  image: string;
  investmentRequired: number;
  dailyPercentage: number;
  durationDays: number;
  totalReturnPercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateInvestmentPlanRequest {
  title: string;
  description: string;
  investmentRequired: number;
  dailyPercentage: number;
  durationDays: number;
  totalReturnPercentage: number;
  image: File;
}

export interface UpdateInvestmentPlanRequest {
  title?: string;
  description?: string;
  investmentRequired?: number;
  dailyPercentage?: number;
  durationDays?: number;
  totalReturnPercentage?: number;
  image?: File;
}

export interface InvestmentPlanResponse {
  success: boolean;
  message: string;
  data: InvestmentPlan;
}

export interface InvestmentPlansResponse {
  success: boolean;
  data: InvestmentPlan[];
}

// User Investment Types
export interface UserInvestment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  planId: {
    _id: string;
    title: string;
  };
  investmentAmount: number;
  dailyEarning: number;
  totalEarned: number;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  isWithdrawn: boolean;
  remainingDays: number;
  totalReturnAmount: number;
}

export interface UserInvestmentsResponse {
  success: boolean;
  data: UserInvestment[];
}

// Withdrawal Request Types
export interface WithdrawalRequest {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  userEmail: string;
  userName: string;
  walletAddress: string;
  amount: number;
  walletType: string;
  status: 'pending' | 'approved' | 'rejected';
  adminId?: string;
  adminName?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  transactionHash?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalRequestsResponse {
  success: boolean;
  data: {
    requests: WithdrawalRequest[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalRequests: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface ApproveWithdrawalRequest {
  transactionHash: string;
  notes?: string;
}

export interface RejectWithdrawalRequest {
  rejectionReason: string;
}

export interface ApproveWithdrawalResponse {
  success: boolean;
  message: string;
  data: {
    requestId: string;
    status: string;
    approvedAt: string;
    adminName: string;
  };
}

export interface RejectWithdrawalResponse {
  success: boolean;
  message: string;
  data: {
    requestId: string;
    status: string;
    rejectedAt: string;
    rejectionReason: string;
    adminName: string;
  };
}

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('admin_token');
  },
  
  setToken: (token: string): void => {
    localStorage.setItem('admin_token', token);
  },
  
  removeToken: (): void => {
    localStorage.removeItem('admin_token');
  },
  
  isTokenValid: (): boolean => {
    const token = tokenManager.getToken();
    if (!token) return false;
    
    try {
      // Basic JWT token validation (check if it's expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
};

// Distribution API Types
export interface DistributionOverview {
  totalUsers: number;
  totalDailyIncome: number;
  totalLevelIncome: number;
  totalCharacterLevelIncome: number;
  totalDigitLevelIncome: number;
  totalNormalWalletBalance: number;
  totalInvestmentWalletBalance: number;
  totalReferralBonus: number;
  totalDeposits: number;
  totalWithdrawals: number;
  dailyDistribution: number;
  weeklyDistribution: number;
  monthlyDistribution: number;
  userBreakdown: DistributionUser[];
}

export interface DistributionUser {
  userId: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  referredBy?: {
    id: string;
    name: string;
    email: string;
  };
  normalWalletBalance: number;
  investmentWalletBalance: number;
  dailyIncome: number;
  characterLevelIncome: number;
  digitLevelIncome: number;
  totalLevelIncome: number;
  totalIncome: number;
  referralBonus: number;
  deposits: number;
  withdrawals: number;
  characterLevel: string;
  digitLevel: string;
  joinedDate: string;
  lastActive: string;
}

export interface DistributionOverviewResponse {
  success: boolean;
  data: DistributionOverview;
}

export interface DailyDistributionStats {
  date: string;
  totalUsers: number;
  activeUsers: number;
  totalDailyIncome: number;
  totalLevelIncome: number;
  totalCharacterLevelIncome: number;
  totalDigitLevelIncome: number;
  averageIncomePerUser: number;
  topEarners: DailyTopEarner[];
  levelBreakdown: {
    characterLevels: Record<string, { count: number; totalIncome: number }>;
    digitLevels: Record<string, { count: number; totalIncome: number }>;
  };
}

export interface DailyTopEarner {
  userId: string;
  name: string;
  email: string;
  totalIncome: number;
  dailyIncome: number;
  characterLevelIncome: number;
  digitLevelIncome: number;
  characterLevel: string;
  digitLevel: string;
}

export interface DailyDistributionResponse {
  success: boolean;
  data: DailyDistributionStats;
}

export interface WeeklyDistributionStats {
  startDate: string;
  endDate: string;
  totalUsers: number;
  newUsers: number;
  totalDailyIncome: number;
  totalLevelIncome: number;
  totalCharacterLevelIncome: number;
  totalDigitLevelIncome: number;
  averageIncomePerUser: number;
  dailyBreakdown: WeeklyDailyBreakdown[];
  topEarners: WeeklyTopEarner[];
}

export interface WeeklyDailyBreakdown {
  date: string;
  dailyIncome: number;
  levelIncome: number;
  totalIncome: number;
}

export interface WeeklyTopEarner {
  userId: string;
  name: string;
  email: string;
  totalIncome: number;
  dailyIncome: number;
  characterLevelIncome: number;
  digitLevelIncome: number;
}

export interface WeeklyDistributionResponse {
  success: boolean;
  data: WeeklyDistributionStats;
}

export interface MonthlyDistributionStats {
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  totalUsers: number;
  newUsers: number;
  totalDailyIncome: number;
  totalLevelIncome: number;
  totalCharacterLevelIncome: number;
  totalDigitLevelIncome: number;
  averageIncomePerUser: number;
  weeklyBreakdown: MonthlyWeeklyBreakdown[];
  topEarners: MonthlyTopEarner[];
}

export interface MonthlyWeeklyBreakdown {
  weekStart: string;
  weekEnd: string;
  dailyIncome: number;
  levelIncome: number;
  totalIncome: number;
  newUsers: number;
}

export interface MonthlyTopEarner {
  userId: string;
  name: string;
  email: string;
  totalIncome: number;
  dailyIncome: number;
  characterLevelIncome: number;
  digitLevelIncome: number;
}

export interface MonthlyDistributionResponse {
  success: boolean;
  data: MonthlyDistributionStats;
}

export interface UserDistributionDetails {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    referralCode: string;
    referredBy?: {
      id: string;
      name: string;
      email: string;
    };
    joinedDate: string;
    lastActive: string;
  };
  wallets: {
    normalWallet: {
      balance: number;
      transactions: DistributionTransaction[];
    };
    investmentWallet: {
      balance: number;
      transactions: DistributionTransaction[];
    };
  };
  income: {
    dailyIncome: number;
    characterLevelIncome: number;
    digitLevelIncome: number;
    totalLevelIncome: number;
    totalIncome: number;
  };
  levels: {
    characterLevel: string;
    digitLevel: string;
    characterLevelEarned: number;
    digitLevelEarned: number;
  };
  statistics: {
    totalDeposits: number;
    totalWithdrawals: number;
    totalReferralBonus: number;
    totalDailyIncomeEarned: number;
  };
}

export interface DistributionTransaction {
  type: string;
  amount: number;
  description: string;
  date: string;
  status: string;
}

export interface UserDistributionResponse {
  success: boolean;
  data: UserDistributionDetails;
}

export interface TopEarnersDistribution {
  totalUsers: number;
  topEarners: TopEarnerDistribution[];
  summary: {
    totalIncome: number;
    averageIncome: number;
    highestIncome: number;
    lowestIncome: number;
  };
}

export interface TopEarnerDistribution {
  userId: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  normalWalletBalance: number;
  investmentWalletBalance: number;
  dailyIncome: number;
  characterLevelIncome: number;
  digitLevelIncome: number;
  totalIncome: number;
  characterLevel: string;
  digitLevel: string;
  joinedDate: string;
  lastActive: string;
}

export interface TopEarnersDistributionResponse {
  success: boolean;
  data: TopEarnersDistribution;
}

// Lucky Draw API Types
export interface LuckyDraw {
  _id: string;
  title: string;
  description: string;
  amount: number;
  maxParticipants: number;
  currentParticipants: number;
  status: 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  drawDate: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface CreateLuckyDrawRequest {
  title: string;
  description: string;
  amount: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  drawDate: string;
}

export interface CreateLuckyDrawResponse {
  success: boolean;
  message: string;
  data: LuckyDraw;
}

export interface LuckyDrawParticipant {
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  userName: string;
  userEmail: string;
  joinedAt: string;
  isWinner: boolean;
  hasClaimed: boolean;
}

export interface LuckyDrawWinner {
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  hasClaimed: boolean;
}

export interface LuckyDrawDetail extends LuckyDraw {
  participants: LuckyDrawParticipant[];
  winners: LuckyDrawWinner[];
}

export interface LuckyDrawDetailResponse {
  success: boolean;
  data: LuckyDrawDetail;
}

export interface LuckyDrawsResponse {
  success: boolean;
  data: {
    luckyDraws: LuckyDraw[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface UpdateLuckyDrawRequest {
  title?: string;
  description?: string;
  amount?: number;
  maxParticipants?: number;
}

export interface UpdateLuckyDrawResponse {
  success: boolean;
  message: string;
  data: LuckyDraw;
}

export interface DeleteLuckyDrawResponse {
  success: boolean;
  message: string;
}

export interface AddUsersToLuckyDrawRequest {
  userIds: string[];
}

export interface AddUsersToLuckyDrawResponse {
  success: boolean;
  message: string;
  data: {
    addedUsers: Array<{
      userId: string;
      name: string;
      email: string;
    }>;
    failedUsers: Array<{
      userId: string;
      name: string;
      email: string;
      reason: string;
    }>;
    currentParticipants: number;
    maxParticipants: number;
  };
}

export interface RemoveUsersFromLuckyDrawRequest {
  userIds: string[];
}

export interface RemoveUsersFromLuckyDrawResponse {
  success: boolean;
  message: string;
  data: {
    removedUsers: string[];
    failedUsers: string[];
    currentParticipants: number;
    maxParticipants: number;
  };
}

export interface DrawWinnersResponse {
  success: boolean;
  message: string;
  data: {
    winners: LuckyDrawWinner[];
    totalPrize: number;
    prizePerWinner: number;
    totalParticipants: number;
  };
}

export interface LuckyDrawStats {
  id: string;
  title: string;
  status: string;
  totalParticipants: number;
  maxParticipants: number;
  participationRate: number;
  totalWinners: number;
  totalPrize: number;
  claimedPrizes: number;
  unclaimedPrizes: number;
  startDate: string;
  endDate: string;
  drawDate: string;
  createdAt: string;
}

export interface LuckyDrawStatsResponse {
  success: boolean;
  data: LuckyDrawStats;
}

// Ticket Support API Types
export interface TicketUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface TicketAdmin {
  _id: string;
  name: string;
  email: string;
}

export interface TicketMessage {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  senderType: 'user' | 'admin';
  content: string;
  messageType: 'text' | 'image' | 'file';
  fileUrl?: string;
  isRead: boolean;
  timestamp: string;
}

export interface Ticket {
  _id: string;
  user: TicketUser;
  admin?: TicketAdmin;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  messages: TicketMessage[];
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface TicketStats {
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  total: number;
}

export interface TicketsResponse {
  success: boolean;
  data: Ticket[];
  stats: TicketStats;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface TicketDetailResponse {
  success: boolean;
  data: Ticket;
}

export interface AssignAdminRequest {
  adminId: string;
}

export interface AssignAdminResponse {
  success: boolean;
  message: string;
  data: Ticket;
}

export interface SendMessageRequest {
  message: string;
  messageType?: 'text' | 'image' | 'file';
  file?: File;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  data: TicketMessage;
}

export interface UpdateStatusRequest {
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

export interface UpdatePriorityRequest {
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UpdateTicketResponse {
  success: boolean;
  message: string;
  data: Ticket;
}

export interface AdminStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  priorityStats: Array<{
    _id: string;
    count: number;
  }>;
  categoryStats: Array<{
    _id: string;
    count: number;
  }>;
  recentTickets: Array<{
    _id: string;
    user: TicketUser;
    admin?: TicketAdmin;
    subject: string;
    status: string;
    lastMessage: string;
  }>;
}

export interface AdminStatsResponse {
  success: boolean;
  data: AdminStats;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AdminsResponse {
  success: boolean;
  data: AdminUser[];
}

export interface UnassignedTicketsResponse {
  success: boolean;
  data: Ticket[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// HTTP client with authentication
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = tokenManager.getToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async requestFormData<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {};

    // Add authorization header if token exists
    const token = tokenManager.getToken();
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Dashboard Statistics
  async getDashboardStatistics(): Promise<ApiResponse<DashboardStatistics>> {
    return this.get<DashboardStatistics>('/admin-dashboard/statistics');
  }

  // User Management
  async getAdminUsers(): Promise<ApiResponse<User[]>> {
    return this.get<User[]>('/admin/users');
  }

  async blockUser(userId: string, isBlocked: boolean): Promise<ApiResponse<BlockUserResponse>> {
    return this.post<BlockUserResponse>(`/admin/users/${userId}/block`, { isBlocked });
  }

  async getUserDetails(userId: string): Promise<ApiResponse<User>> {
    return this.get<User>(`/admin/users/${userId}`);
  }

  async getRecentUsers(page: number = 1, limit: number = 10): Promise<ApiResponse<RecentUsersResponse>> {
    return this.get<RecentUsersResponse>(`/recent-users?page=${page}&limit=${limit}`);
  }

  // Transactions
  async getRecentTransactions(page: number = 1, limit: number = 20): Promise<ApiResponse<RecentTransactionsResponse>> {
    return this.get<RecentTransactionsResponse>(`/recent-transactions?page=${page}&limit=${limit}`);
  }

  // Analytics
  async getUserGrowth(period: number = 30): Promise<ApiResponse<UserGrowthResponse>> {
    return this.get<UserGrowthResponse>(`/user-growth?period=${period}`);
  }

  async getRevenueChart(period: number = 30): Promise<ApiResponse<RevenueChartResponse>> {
    return this.get<RevenueChartResponse>(`/revenue-chart?period=${period}`);
  }

  async getTopUsers(type: string = 'investment'): Promise<ApiResponse<TopUsersResponse>> {
    return this.get<TopUsersResponse>(`/top-users?type=${type}`);
  }

  // Revenue Management
  async getRevenueOverview(): Promise<ApiResponse<RevenueOverviewResponse>> {
    return this.get<RevenueOverviewResponse>('/admin-revenue/overview');
  }

  async getRevenueDeposits(page: number = 1, limit: number = 10): Promise<ApiResponse<RevenueDepositsResponse>> {
    return this.get<RevenueDepositsResponse>(`/admin/revenue/deposits?page=${page}&limit=${limit}`);
  }

  async getRevenueWithdrawals(page: number = 1, limit: number = 10): Promise<ApiResponse<WithdrawalsResponse>> {
    return this.get<WithdrawalsResponse>(`/admin/revenue/withdrawals?page=${page}&limit=${limit}`);
  }

  async getRevenueInvestments(page: number = 1, limit: number = 10): Promise<ApiResponse<InvestmentsResponse>> {
    return this.get<InvestmentsResponse>(`/admin/revenue/investments?page=${page}&limit=${limit}`);
  }

  async getRevenueChartData(period: number = 30): Promise<ApiResponse<RevenueChartResponse>> {
    return this.get<RevenueChartResponse>(`/admin/revenue/chart?period=${period}`);
  }

  async getTopRevenueUsers(type: string = 'deposit'): Promise<ApiResponse<TopRevenueUsersResponse>> {
    return this.get<TopRevenueUsersResponse>(`/admin/revenue/top-users?type=${type}`);
  }

  async exportRevenueData(type: string, period: number): Promise<ApiResponse<ExportDataResponse>> {
    return this.get<ExportDataResponse>(`/admin/revenue/export?type=${type}&period=${period}`);
  }

  // Deposit Requests
  async getDeposits(): Promise<ApiResponse<DepositRequest[]>> {
    return this.get<DepositRequest[]>('/admin/deposits');
  }

  async approveDepositRequest(depositId: string, data: ApproveDepositRequest): Promise<ApiResponse<ApproveDepositResponse>> {
    return this.post<ApproveDepositResponse>(`/admin/deposits/${depositId}/approve`, data);
  }

  // First Deposit Bonus
  async getFirstDepositBonusStatus(): Promise<ApiResponse<UserWithBonus[]>> {
    return this.get<UserWithBonus[]>('/admin/first-deposit-bonuses');
  }

  async updateBonusPercentage(percentage: number): Promise<ApiResponse<UpdateBonusPercentageResponse>> {
    return this.post<UpdateBonusPercentageResponse>('/admin/first-deposit-bonus-percentage', { percentage });
  }

  async getBonusPercentage(): Promise<ApiResponse<GetBonusPercentageResponse>> {
    return this.get<GetBonusPercentageResponse>('/admin/first-deposit-bonus-percentage');
  }

  // Investment Plans
  async getInvestmentPlans(): Promise<ApiResponse<InvestmentPlan[]>> {
    return this.get<InvestmentPlan[]>('/investment/admin/plans');
  }

  async createInvestmentPlan(data: CreateInvestmentPlanRequest): Promise<ApiResponse<InvestmentPlanResponse>> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('investmentRequired', data.investmentRequired.toString());
    formData.append('dailyPercentage', data.dailyPercentage.toString());
    formData.append('durationDays', data.durationDays.toString());
    formData.append('totalReturnPercentage', data.totalReturnPercentage.toString());
    formData.append('image', data.image);
    
    const token = tokenManager.getToken();
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
    };
    
    return this.requestFormData<InvestmentPlanResponse>('/investment/admin/plans', {
      method: 'POST',
      body: formData,
      headers,
    });
  }

  async updateInvestmentPlan(planId: string, data: UpdateInvestmentPlanRequest): Promise<ApiResponse<InvestmentPlanResponse>> {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.investmentRequired !== undefined) formData.append('investmentRequired', data.investmentRequired.toString());
    if (data.dailyPercentage !== undefined) formData.append('dailyPercentage', data.dailyPercentage.toString());
    if (data.durationDays !== undefined) formData.append('durationDays', data.durationDays.toString());
    if (data.totalReturnPercentage !== undefined) formData.append('totalReturnPercentage', data.totalReturnPercentage.toString());
    if (data.image) {
      formData.append('image', data.image);
    }
    
    const token = tokenManager.getToken();
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
    };
    
    return this.requestFormData<InvestmentPlanResponse>(`/investment/admin/plans/${planId}`, {
      method: 'PUT',
      body: formData,
      headers,
    });
  }

  async toggleInvestmentPlan(planId: string): Promise<ApiResponse<InvestmentPlanResponse>> {
    return this.patch<InvestmentPlanResponse>(`/investment/admin/plans/${planId}/toggle`);
  }

  async deleteInvestmentPlan(planId: string): Promise<ApiResponse<InvestmentPlanResponse>> {
    return this.delete<InvestmentPlanResponse>(`/investment/admin/plans/${planId}`);
  }

  // User Investments
  async getUserInvestments(): Promise<ApiResponse<UserInvestment[]>> {
    return this.get<UserInvestment[]>('/investment/admin/investments');
  }

  // Withdrawal Requests
  async getWithdrawalRequests(): Promise<ApiResponse<WithdrawalRequestsResponse>> {
    return this.get<WithdrawalRequestsResponse>('/withdrawal/all-requests');
  }
  async approveWithdrawalRequest(requestId: string, data: ApproveWithdrawalRequest): Promise<ApiResponse<ApproveWithdrawalResponse>> {
    return this.post<ApproveWithdrawalResponse>(`/withdrawal/approve/${requestId}`, data);
  }

  async rejectWithdrawalRequest(requestId: string, data: RejectWithdrawalRequest): Promise<ApiResponse<RejectWithdrawalResponse>> {
    return this.post<RejectWithdrawalResponse>(`/withdrawal/reject/${requestId}`, data);
  }

  // Distribution API Methods
  async getDistributionOverview(startDate?: string, endDate?: string): Promise<ApiResponse<DistributionOverviewResponse>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return this.get<DistributionOverviewResponse>(`/admin-distribution/overview?${params.toString()}`);
  }

  async getDailyDistribution(date?: string): Promise<ApiResponse<DailyDistributionResponse>> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    return this.get<DailyDistributionResponse>(`/admin-distribution/daily?${params.toString()}`);
  }

  async getWeeklyDistribution(startDate?: string, endDate?: string): Promise<ApiResponse<WeeklyDistributionResponse>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return this.get<WeeklyDistributionResponse>(`/admin-distribution/weekly?${params.toString()}`);
  }

  async getMonthlyDistribution(year?: number, month?: number): Promise<ApiResponse<MonthlyDistributionResponse>> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    return this.get<MonthlyDistributionResponse>(`/admin-distribution/monthly?${params.toString()}`);
  }

  async getUserDistributionDetails(userId: string, startDate?: string, endDate?: string): Promise<ApiResponse<UserDistributionResponse>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return this.get<UserDistributionResponse>(`/admin-distribution/user/${userId}?${params.toString()}`);
  }

  async getTopEarnersDistribution(limit?: number, period?: string): Promise<ApiResponse<TopEarnersDistributionResponse>> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (period) params.append('period', period);
    return this.get<TopEarnersDistributionResponse>(`/admin-distribution/top-earners?${params.toString()}`);
  }

  // Lucky Draw API Methods
  async createLuckyDraw(data: CreateLuckyDrawRequest): Promise<ApiResponse<CreateLuckyDrawResponse>> {
    return this.post<CreateLuckyDrawResponse>('/admin-luckydraw/create', data);
  }

  async getLuckyDraws(page: number = 1, limit: number = 10): Promise<ApiResponse<LuckyDrawsResponse>> {
    return this.get<LuckyDrawsResponse>(`/admin-luckydraw/all?page=${page}&limit=${limit}`);
  }

  async getLuckyDrawDetails(luckyDrawId: string): Promise<ApiResponse<LuckyDrawDetailResponse>> {
    return this.get<LuckyDrawDetailResponse>(`/admin-luckydraw/${luckyDrawId}`);
  }

  async updateLuckyDraw(luckyDrawId: string, data: UpdateLuckyDrawRequest): Promise<ApiResponse<UpdateLuckyDrawResponse>> {
    return this.put<UpdateLuckyDrawResponse>(`/admin-luckydraw/${luckyDrawId}`, data);
  }

  async deleteLuckyDraw(luckyDrawId: string): Promise<ApiResponse<DeleteLuckyDrawResponse>> {
    return this.delete<DeleteLuckyDrawResponse>(`/admin-luckydraw/${luckyDrawId}`);
  }

  async addUsersToLuckyDraw(luckyDrawId: string, data: AddUsersToLuckyDrawRequest): Promise<ApiResponse<AddUsersToLuckyDrawResponse>> {
    return this.post<AddUsersToLuckyDrawResponse>(`/admin-luckydraw/${luckyDrawId}/add-users`, data);
  }

  async removeUsersFromLuckyDraw(luckyDrawId: string, data: RemoveUsersFromLuckyDrawRequest): Promise<ApiResponse<RemoveUsersFromLuckyDrawResponse>> {
    return this.post<RemoveUsersFromLuckyDrawResponse>(`/admin-luckydraw/${luckyDrawId}/remove-users`, data);
  }

  async drawWinners(luckyDrawId: string): Promise<ApiResponse<DrawWinnersResponse>> {
    return this.post<DrawWinnersResponse>(`/admin-luckydraw/${luckyDrawId}/draw-winners`);
  }

  async getLuckyDrawStats(luckyDrawId: string): Promise<ApiResponse<LuckyDrawStatsResponse>> {
    return this.get<LuckyDrawStatsResponse>(`/admin-luckydraw/${luckyDrawId}/stats`);
  }

  // Ticket Support API Methods
  async getTickets(page: number = 1, limit: number = 20, filters?: {
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
  }): Promise<ApiResponse<TicketsResponse>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo);
    
    return this.get<TicketsResponse>(`/admin-chat/tickets?${params.toString()}`);
  }

  async getTicketDetails(ticketId: string): Promise<ApiResponse<TicketDetailResponse>> {
    return this.get<TicketDetailResponse>(`/admin-chat/ticket/${ticketId}`);
  }

  async assignAdminToTicket(ticketId: string, adminId: string): Promise<ApiResponse<AssignAdminResponse>> {
    return this.put<AssignAdminResponse>(`/admin-chat/ticket/${ticketId}/assign`, { adminId });
  }

  async sendTicketMessage(ticketId: string, data: SendMessageRequest): Promise<ApiResponse<SendMessageResponse>> {
    const formData = new FormData();
    formData.append('message', data.message);
    if (data.messageType) formData.append('messageType', data.messageType);
    if (data.file) formData.append('file', data.file);
    
    const token = tokenManager.getToken();
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
    };
    
    return this.requestFormData<SendMessageResponse>(`/admin-chat/ticket/${ticketId}/message`, {
      method: 'POST',
      body: formData,
      headers,
    });
  }

  async updateTicketStatus(ticketId: string, status: string): Promise<ApiResponse<UpdateTicketResponse>> {
    return this.put<UpdateTicketResponse>(`/admin-chat/ticket/${ticketId}/status`, { status });
  }

  async updateTicketPriority(ticketId: string, priority: string): Promise<ApiResponse<UpdateTicketResponse>> {
    return this.put<UpdateTicketResponse>(`/admin-chat/ticket/${ticketId}/priority`, { priority });
  }

  async getTicketStats(): Promise<ApiResponse<AdminStatsResponse>> {
    return this.get<AdminStatsResponse>('/admin-chat/stats');
  }

  async getAdmins(): Promise<ApiResponse<AdminsResponse>> {
    return this.get<AdminsResponse>('/admin-chat/admins');
  }

  async getUnassignedTickets(page: number = 1, limit: number = 20): Promise<ApiResponse<UnassignedTicketsResponse>> {
    return this.get<UnassignedTicketsResponse>(`/admin-chat/unassigned?page=${page}&limit=${limit}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);