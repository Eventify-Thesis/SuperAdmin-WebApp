import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

// Direct connection to Event-Service for SuperAdmin
const eventServiceApi = axios.create({
  baseURL: API_CONFIG.EVENT_SERVICE_URL,
  timeout: API_CONFIG.DEFAULT_TIMEOUT,
});

export interface IssueReport {
  id: number;
  userId: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  userFirstName?: string;
  userLastName?: string;
  userImageUrl?: string;
}

export enum IssueCategory {
  BUG = 'bug',
  TRANSACTION = 'transaction',
  UI_UX = 'ui_ux',
  FEATURE_REQUEST = 'feature_request',
  ACCOUNT = 'account',
  OTHER = 'other',
}

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum IssuePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface UpdateIssueReportRequest {
  title?: string;
  description?: string;
  category?: IssueCategory;
  priority?: IssuePriority;
  status?: IssueStatus;
  imageUrls?: string[];
}

export interface IssueReportListData {
  issueReports: IssueReport[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IssueReportListResponse {
  data: IssueReportListData;
}

export const issueReportsApi = {
  getAllIssueReports: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<IssueReportListResponse> => {
    const response = await eventServiceApi.get(
      `/superadmin/issue-reports?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getIssueReport: async (issueReportId: number): Promise<IssueReport> => {
    const response = await eventServiceApi.get(
      `/superadmin/issue-reports/${issueReportId}`,
    );
    return response.data;
  },

  updateIssueReport: async (
    issueReportId: number,
    data: UpdateIssueReportRequest,
  ): Promise<IssueReport> => {
    const response = await eventServiceApi.put(
      `/superadmin/issue-reports/${issueReportId}`,
      data,
    );
    return response.data;
  },

  deleteIssueReport: async (issueReportId: number): Promise<void> => {
    await eventServiceApi.delete(`/superadmin/issue-reports/${issueReportId}`);
  },

  // Helper functions for dropdowns
  getCategoryOptions: () => [
    { value: IssueCategory.BUG, label: '🐛 Bug Report' },
    { value: IssueCategory.TRANSACTION, label: '💳 Transaction Issue' },
    { value: IssueCategory.UI_UX, label: '🎨 UI/UX Issue' },
    { value: IssueCategory.FEATURE_REQUEST, label: '✨ Feature Request' },
    { value: IssueCategory.ACCOUNT, label: '👤 Account Issue' },
    { value: IssueCategory.OTHER, label: '❓ Other' },
  ],

  getStatusOptions: () => [
    { value: IssueStatus.OPEN, label: '🔴 Open' },
    { value: IssueStatus.IN_PROGRESS, label: '🟡 In Progress' },
    { value: IssueStatus.RESOLVED, label: '🟢 Resolved' },
    { value: IssueStatus.CLOSED, label: '⚫ Closed' },
  ],

  getPriorityOptions: () => [
    { value: IssuePriority.LOW, label: '🟢 Low' },
    { value: IssuePriority.MEDIUM, label: '🟡 Medium' },
    { value: IssuePriority.HIGH, label: '🟠 High' },
    { value: IssuePriority.URGENT, label: '�� Urgent' },
  ],
};
