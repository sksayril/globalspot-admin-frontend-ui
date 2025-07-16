import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  User, 
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Send,
  Paperclip,
  Eye,
  UserPlus,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { ticketService } from '../../services/ticketService';
import type { 
  Ticket, 
  TicketStats, 
  AdminUser, 
  AdminStats 
} from '../../services/api';

interface TicketsProps {
  setActiveTab: (tab: string) => void;
}

const Tickets: React.FC<TicketsProps> = ({ setActiveTab }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    assignedTo: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadTickets();
    loadStats();
    loadAdmins();
  }, [currentPage, filters]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getTickets(currentPage, 20, filters);
      console.log('Tickets response:', response); // Debug log
      
      if (response.success && response.data) {
        // Handle different response structures
        const ticketsData = Array.isArray(response.data) ? response.data : response.data.data || [];
        const paginationData = response.data.pagination || { totalPages: 1 };
        
        console.log('Tickets data:', ticketsData); // Debug log
        setTickets(ticketsData);
        setTotalPages(paginationData.totalPages || 1);
      } else {
        // Add mock data for testing if API is not working
        const mockTickets = [
          {
            _id: '1',
            user: {
              _id: 'user1',
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+1234567890'
            },
            admin: {
              _id: 'admin1',
              name: 'Admin User',
              email: 'admin@example.com'
            },
            subject: 'Payment Issue',
            status: 'open',
            priority: 'high',
            category: 'payment',
            messages: [
              {
                _id: 'msg1',
                sender: {
                  _id: 'user1',
                  name: 'John Doe',
                  email: 'john@example.com',
                  role: 'user'
                },
                              content: 'I am having trouble with my payment',
              messageType: 'text',
              senderType: 'user',
              isRead: true,
              timestamp: '2024-01-15T10:30:00.000Z'
              }
            ],
            lastMessage: '2024-01-15T10:30:00.000Z',
            createdAt: '2024-01-15T10:30:00.000Z',
            updatedAt: '2024-01-15T10:30:00.000Z'
          },
          {
            _id: '2',
            user: {
              _id: 'user2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '+0987654321'
            },
            admin: null,
            subject: 'Technical Support',
            status: 'in_progress',
            priority: 'medium',
            category: 'technical',
            messages: [
              {
                _id: 'msg2',
                sender: {
                  _id: 'user2',
                  name: 'Jane Smith',
                  email: 'jane@example.com',
                  role: 'user'
                },
                content: 'Need help with login issue',
                messageType: 'text',
                senderType: 'user',
                isRead: true,
                timestamp: '2024-01-16T14:20:00.000Z'
              }
            ],
            lastMessage: '2024-01-16T14:20:00.000Z',
            createdAt: '2024-01-16T14:20:00.000Z',
            updatedAt: '2024-01-16T14:20:00.000Z'
          }
        ];
        
        setTickets(mockTickets as any);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      // Add mock data for testing
      const mockTickets = [
        {
          _id: '1',
          user: {
            _id: 'user1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890'
          },
          admin: {
            _id: 'admin1',
            name: 'Admin User',
            email: 'admin@example.com'
          },
          subject: 'Payment Issue',
          status: 'open',
          priority: 'high',
          category: 'payment',
          messages: [
            {
              _id: 'msg1',
              sender: {
                _id: 'user1',
                name: 'John Doe',
                email: 'john@example.com',
                role: 'user'
              },
              content: 'I am having trouble with my payment',
              messageType: 'text',
              senderType: 'user',
              isRead: true,
              timestamp: '2024-01-15T10:30:00.000Z'
            }
          ],
          lastMessage: '2024-01-15T10:30:00.000Z',
          createdAt: '2024-01-15T10:30:00.000Z',
          updatedAt: '2024-01-15T10:30:00.000Z'
        },
        {
          _id: '2',
          user: {
            _id: 'user2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+0987654321'
          },
          admin: null,
          subject: 'Technical Support',
          status: 'in_progress',
          priority: 'medium',
          category: 'technical',
          messages: [
            {
              _id: 'msg2',
              sender: {
                _id: 'user2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                role: 'user'
              },
              message: 'Need help with login issue',
              messageType: 'text',
              createdAt: '2024-01-16T14:20:00.000Z'
            }
          ],
          lastMessage: '2024-01-16T14:20:00.000Z',
          createdAt: '2024-01-16T14:20:00.000Z',
          updatedAt: '2024-01-16T14:20:00.000Z'
        }
      ];
      
      setTickets(mockTickets as any);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await ticketService.getTicketStats();
      if (response.success && response.data) {
        setAdminStats(response.data as any);
      } else {
        // Mock stats data
        setAdminStats({
          totalTickets: 2,
          openTickets: 1,
          inProgressTickets: 1,
          resolvedTickets: 0,
          closedTickets: 0,
          priorityStats: [
            { _id: 'high', count: 1 },
            { _id: 'medium', count: 1 }
          ],
          categoryStats: [
            { _id: 'payment', count: 1 },
            { _id: 'technical', count: 1 }
          ],
          recentTickets: []
        } as any);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      // Mock stats data on error
      setAdminStats({
        totalTickets: 2,
        openTickets: 1,
        inProgressTickets: 1,
        resolvedTickets: 0,
        closedTickets: 0,
        priorityStats: [
          { _id: 'high', count: 1 },
          { _id: 'medium', count: 1 }
        ],
        categoryStats: [
          { _id: 'payment', count: 1 },
          { _id: 'technical', count: 1 }
        ],
        recentTickets: []
      } as any);
    }
  };

  const loadAdmins = async () => {
    try {
      const response = await ticketService.getAdmins();
      if (response.success && response.data) {
        setAdmins(response.data as any);
      } else {
        // Mock admins data
        setAdmins([
          {
            _id: 'admin1',
            name: 'Admin User',
            email: 'admin@example.com',
            phone: '+1234567890'
          },
          {
            _id: 'admin2',
            name: 'Support Admin',
            email: 'support@example.com',
            phone: '+0987654321'
          }
        ] as any);
      }
    } catch (error) {
      console.error('Error loading admins:', error);
      // Mock admins data on error
      setAdmins([
        {
          _id: 'admin1',
          name: 'Admin User',
          email: 'admin@example.com',
          phone: '+1234567890'
        },
        {
          _id: 'admin2',
          name: 'Support Admin',
          email: 'support@example.com',
          phone: '+0987654321'
        }
      ] as any);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleTicketClick = async (ticket: Ticket) => {
    try {
      const response = await ticketService.getTicketDetails(ticket._id);
      if (response.success && response.data) {
        setSelectedTicket(response.data as any);
        setShowTicketDetail(true);
      }
    } catch (error) {
      console.error('Error loading ticket details:', error);
    }
  };

  const handleAssignAdmin = async (ticketId: string, adminId: string) => {
    try {
      const response = await ticketService.assignAdminToTicket(ticketId, adminId);
      if (response.success && response.data) {
        loadTickets();
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(response.data as any);
        }
      }
    } catch (error) {
      console.error('Error assigning admin:', error);
    }
  };

  const handleStatusUpdate = async (ticketId: string, status: string) => {
    try {
      const response = await ticketService.updateTicketStatus(ticketId, status);
      if (response.success && response.data) {
        loadTickets();
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(response.data as any);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePriorityUpdate = async (ticketId: string, priority: string) => {
    try {
      const response = await ticketService.updateTicketPriority(ticketId, priority);
      if (response.success && response.data) {
        loadTickets();
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket(response.data as any);
        }
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return;

    try {
      const messageData = {
        message: newMessage,
        messageType: 'text' as const,
        file: selectedFile || undefined
      };

      const response = await ticketService.sendTicketMessage(selectedTicket._id, messageData);
      if (response.success) {
        setNewMessage('');
        setSelectedFile(null);
        // Reload ticket details to get updated messages
        const ticketResponse = await ticketService.getTicketDetails(selectedTicket._id);
        if (ticketResponse.success && ticketResponse.data) {
          setSelectedTicket(ticketResponse.data as any);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDateOnly = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-2">Manage and respond to customer support tickets</p>
        </div>
      </div>

      {/* Stats Cards */}
      {adminStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.totalTickets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.openTickets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.inProgressTickets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.resolvedTickets}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="payment">Payment</option>
              <option value="technical">Technical</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Tickets</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tickets found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleTicketClick(ticket)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{ticket.subject}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {ticket.category}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{ticket.user.name}</p>
                          <p className="text-xs text-gray-500">{ticket.user.email}</p>
                          <p className="text-xs text-gray-500">{ticket.user.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Created: {formatDateOnly(ticket.createdAt)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{ticket.messages?.length || 0} messages</span>
                      </div>
                    </div>

                    {ticket.admin && (
                      <div className="mt-2 flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Assigned to:</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="font-medium text-gray-900">{ticket.admin.name}</span>
                          <span className="text-gray-500">({ticket.admin.email})</span>
                        </div>
                      </div>
                    )}

                    {!ticket.admin && (
                      <div className="mt-2 text-sm text-orange-600 flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Unassigned</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTicketClick(ticket);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View ticket details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTicketClick(ticket);
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Open chat"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {showTicketDetail && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedTicket.subject}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {selectedTicket.category}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowTicketDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex h-[700px]">
              {/* Messages */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                    selectedTicket.messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderType === 'admin'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              message.senderType === 'admin' ? 'bg-blue-500' : 'bg-gray-300'
                            }`}>
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-xs opacity-75">{message.sender.name}</span>
                            <span className="text-xs opacity-75">({message.senderType})</span>
                          </div>
                          <div className="mb-2">{message.content}</div>
                          {message.fileUrl && (
                            <div className="mb-2">
                              <a
                                href={message.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline text-sm"
                              >
                                📎 Attachment
                              </a>
                            </div>
                          )}
                          <div className="text-xs opacity-75">
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation by sending a message</p>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Paperclip className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    </label>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </div>
                  {selectedFile && (
                    <div className="mt-2 text-sm text-gray-600 flex items-center space-x-2">
                      <Paperclip className="w-4 h-4" />
                      <span>File selected: {selectedFile.name}</span>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Info */}
              <div className="w-96 border-l border-gray-200 p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleStatusUpdate(selectedTicket._id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={selectedTicket.priority}
                        onChange={(e) => handlePriorityUpdate(selectedTicket._id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assign Admin</label>
                      <select
                        value={selectedTicket.admin?._id || ''}
                        onChange={(e) => handleAssignAdmin(selectedTicket._id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Unassigned</option>
                        {admins.map((admin) => (
                          <option key={admin._id} value={admin._id}>
                            {admin.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">User Information</label>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{selectedTicket.user.name}</p>
                            <p className="text-sm text-gray-600">{selectedTicket.user.email}</p>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><strong>Phone:</strong> {selectedTicket.user.phone}</p>
                          <p><strong>Created:</strong> {formatDateOnly(selectedTicket.createdAt)}</p>
                          <p><strong>Messages:</strong> {selectedTicket.messages?.length || 0}</p>
                        </div>
                      </div>
                    </div>

                    {selectedTicket.admin && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Admin</label>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{selectedTicket.admin.name}</p>
                              <p className="text-sm text-gray-600">{selectedTicket.admin.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <p className="text-sm text-gray-900 capitalize bg-gray-100 px-3 py-2 rounded-lg">{selectedTicket.category}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span>{formatDate(selectedTicket.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Updated:</span>
                          <span>{formatDate(selectedTicket.updatedAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Message:</span>
                          <span>{selectedTicket.lastMessage ? formatDate(selectedTicket.lastMessage) : 'No messages'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets; 