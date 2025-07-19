import { apiClient } from './api';
import type {
  WalletChangeRequest,
  WalletChangeRequestDetail,
  WalletChangeRequestsResponse,
  PendingWalletChangesResponse,
  ProcessWalletChangeRequest,
  ProcessWalletChangeResponse,
  WalletChangeDetailsResponse,
  BulkProcessWalletChangeRequest,
  BulkProcessWalletChangeResponse
} from './api';

export const walletService = {
  // Get all wallet change requests with filters
  getWalletChangeRequests: async (page: number = 1, limit: number = 20, filters?: {
    status?: string;
    userId?: string;
  }) => {
    return await apiClient.getWalletChangeRequests(page, limit, filters);
  },

  // Get pending wallet changes
  getPendingWalletChanges: async (page: number = 1, limit: number = 20) => {
    return await apiClient.getPendingWalletChanges(page, limit);
  },

  // Process a single wallet change request
  processWalletChangeRequest: async (requestId: string, data: ProcessWalletChangeRequest) => {
    return await apiClient.processWalletChangeRequest(requestId, data);
  },

  // Get wallet change request details
  getWalletChangeDetails: async (requestId: string) => {
    return await apiClient.getWalletChangeDetails(requestId);
  },

  // Bulk process wallet changes
  bulkProcessWalletChanges: async (data: BulkProcessWalletChangeRequest) => {
    return await apiClient.bulkProcessWalletChanges(data);
  }
}; 