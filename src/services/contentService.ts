import { apiClient } from './api';
import type {
  Content,
  ContentListResponse,
  ContentResponse,
  CreateContentRequest,
  UpdateContentRequest
} from './api';

export const contentService = {
  // Upload new content
  uploadContent: async (data: CreateContentRequest) => {
    return await apiClient.uploadContent(data);
  },

  // Get all content with pagination
  getContentList: async (page: number = 1, limit: number = 10) => {
    return await apiClient.getContentList(page, limit);
  },

  // Get single content by ID
  getContentById: async (contentId: string) => {
    return await apiClient.getContentById(contentId);
  },

  // Update content
  updateContent: async (contentId: string, data: UpdateContentRequest) => {
    return await apiClient.updateContent(contentId, data);
  },

  // Delete content
  deleteContent: async (contentId: string) => {
    return await apiClient.deleteContent(contentId);
  }
}; 