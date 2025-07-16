import { apiClient } from './api';
import type {
  TicketsResponse,
  TicketDetailResponse,
  AssignAdminResponse,
  SendMessageResponse,
  UpdateTicketResponse,
  AdminStatsResponse,
  AdminsResponse,
  UnassignedTicketsResponse,
  SendMessageRequest
} from './api';

export const ticketService = {
  // Get all tickets with filters
  getTickets: async (page: number = 1, limit: number = 20, filters?: {
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
  }) => {
    return await apiClient.getTickets(page, limit, filters);
  },

  // Get specific ticket details
  getTicketDetails: async (ticketId: string) => {
    return await apiClient.getTicketDetails(ticketId);
  },

  // Assign admin to ticket
  assignAdminToTicket: async (ticketId: string, adminId: string) => {
    return await apiClient.assignAdminToTicket(ticketId, adminId);
  },

  // Send message to ticket
  sendTicketMessage: async (ticketId: string, data: SendMessageRequest) => {
    return await apiClient.sendTicketMessage(ticketId, data);
  },

  // Update ticket status
  updateTicketStatus: async (ticketId: string, status: string) => {
    return await apiClient.updateTicketStatus(ticketId, status);
  },

  // Update ticket priority
  updateTicketPriority: async (ticketId: string, priority: string) => {
    return await apiClient.updateTicketPriority(ticketId, priority);
  },

  // Get ticket statistics
  getTicketStats: async () => {
    return await apiClient.getTicketStats();
  },

  // Get all admins
  getAdmins: async () => {
    return await apiClient.getAdmins();
  },

  // Get unassigned tickets
  getUnassignedTickets: async (page: number = 1, limit: number = 20) => {
    return await apiClient.getUnassignedTickets(page, limit);
  }
}; 