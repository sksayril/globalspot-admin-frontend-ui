export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  joinDate: string;
  avatar: string;
}

export interface Revenue {
  id: string;
  amount: number;
  source: string;
  date: string;
  status: 'completed' | 'pending';
}

export interface Investment {
  id: string;
  title: string;
  amount: number;
  returns: number;
  date: string;
  status: 'active' | 'completed' | 'pending';
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  purpose: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  bankAccount: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

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

export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  loading: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}