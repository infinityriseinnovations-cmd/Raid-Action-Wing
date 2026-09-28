/**
 * Centralized API Service Layer for RAID ACTION WING FOUNDATION (RAWF)
 * 
 * Provides unified, type-safe HTTP communication with the backend.
 * Compatible with cPanel deployments (Node.js backend proxy or Apache/PHP REST API).
 */

// Base Configuration
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  [key: string]: any;
}

export interface ApiError {
  success: false;
  message: string;
  status?: number;
}

// ----------------------------------------------------------------------
// Types & Domain Entities
// ----------------------------------------------------------------------

export interface Officer {
  id: string;
  uidNumber: string;
  badgeNumber: string;
  name: string;
  gender?: 'Male' | 'Female' | 'Other' | string;
  dob?: string;
  joinDate?: string;
  phoneContact?: string;
  email: string;
  designation: string;
  division: 'national' | 'state' | 'legal';
  state: string;
  status: 'ACTIVE' | 'VERIFIED' | 'COMMAND' | 'SUSPENDED' | 'REVOKED';
  photoUrl: string;
  validTill: string;
  mandate: string;
}

export interface BlacklistedOfficer {
  id: string;
  name: string;
  badgeNumber: string;
  jurisdiction: string;
  revocationDate: string;
  reason: string;
  status: 'REVOKED & BLACKLISTED';
}

export interface MemberApplication {
  applicationId: string;
  fullName: string;
  mobile: string;
  email: string;
  wing: string;
  state: string;
  aadhaarLast4: string;
  voterId?: string;
  background: string;
  submittedAt: string;
  status: 'Pending Verification' | 'Approved' | 'Rejected' | 'Interview Scheduled';
  assignedBadge?: string;
  notes?: string;
}

export interface GrievanceRecord {
  trackingId: string;
  category: string;
  state: string;
  targetEntity: string;
  narrative: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterContact?: string;
  createdAt: string;
  status: 'Received' | 'Assigned to Directorate' | 'Fact-Finding & Evidence' | 'Escalated to Statutory Body' | 'Closed';
  statusDetails: string;
  assignedOfficerId?: string;
}

export interface ActivityRecord {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  description: string;
  content: string;
  image: string;
  author?: string;
  status: 'Published' | 'Draft';
  createdAt?: string;
}

export interface DonationRecord {
  receiptId: string;
  donorName: string;
  panNumber?: string;
  donorPhone?: string;
  amount: number;
  fund: string;
  paymentMethod: string;
  utrNumber?: string;
  upiId?: string;
  timestamp: string;
  taxExemptionEligible: boolean;
  status: 'Confirmed' | 'Pending';
}

export interface OfficerVerifyResult {
  verified: boolean;
  isBlacklisted?: boolean;
  message: string;
  officer?: Partial<Officer>;
}

// ----------------------------------------------------------------------
// Core HTTP Request Client
// ----------------------------------------------------------------------

class ApiClient {
  private getHeaders(token?: string, customHeaders?: HeadersInit): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }

    return headers;
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(token, options.headers),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data as T;
    } catch (error: any) {
      console.error(`[API Error] ${options.method || 'GET'} ${url}:`, error.message || error);
      throw error;
    }
  }

  public get<T = any>(endpoint: string, params?: Record<string, any>, token?: string): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request<T>(url, { method: 'GET' }, token);
  }

  public post<T = any>(endpoint: string, body?: any, token?: string): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      token
    );
  }

  public put<T = any>(endpoint: string, body?: any, token?: string): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      },
      token
    );
  }

  public delete<T = any>(endpoint: string, body?: any, token?: string): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'DELETE',
        body: body ? JSON.stringify(body) : undefined,
      },
      token
    );
  }
}

export const apiClient = new ApiClient();

// ----------------------------------------------------------------------
// Specialized Domain APIs
// ----------------------------------------------------------------------

/**
 * Officers & Verification Desk API
 */
export const officersApi = {
  getAll: (params?: { division?: string; search?: string }) => {
    return apiClient.get<ApiResponse<Officer[]>>('/api/officers', params);
  },

  verify: (code: string) => {
    return apiClient.post<ApiResponse & OfficerVerifyResult>('/api/officers/verify', { code });
  },

  getBlacklist: () => {
    return apiClient.get<ApiResponse<BlacklistedOfficer[]>>('/api/blacklist');
  },

  create: (officer: Partial<Officer>, token: string) => {
    return apiClient.post<ApiResponse<Officer>>('/api/admin/officers', officer, token);
  },

  update: (id: string, officer: Partial<Officer>, token: string) => {
    return apiClient.put<ApiResponse<Officer>>(`/api/admin/officers/${encodeURIComponent(id)}`, officer, token);
  },

  delete: (id: string, token: string) => {
    return apiClient.delete<ApiResponse>(`/api/admin/officers/${encodeURIComponent(id)}`, undefined, token);
  },
};

/**
 * Membership Applications API
 */
export const membershipApi = {
  submit: (application: {
    fullName: string;
    mobile: string;
    email: string;
    wing: string;
    state: string;
    aadhaarNumber: string;
    background?: string;
  }) => {
    return apiClient.post<ApiResponse & { applicationId: string }>('/api/memberships', application);
  },

  getAll: (token: string, params?: { status?: string; search?: string }) => {
    return apiClient.get<ApiResponse<MemberApplication[]>>('/api/admin/applications', params, token);
  },

  updateStatus: (
    applicationId: string,
    updateData: { status: string; assignedBadge?: string; notes?: string },
    token: string
  ) => {
    return apiClient.put<ApiResponse>(
      `/api/admin/applications/${encodeURIComponent(applicationId)}`,
      updateData,
      token
    );
  },

  delete: (applicationId: string, token: string) => {
    return apiClient.delete<ApiResponse>(
      `/api/admin/applications/${encodeURIComponent(applicationId)}`,
      undefined,
      token
    );
  },
};

/**
 * Grievances & Intelligence Telemetry API
 */
export const grievanceApi = {
  submit: (report: {
    category: string;
    state: string;
    targetEntity: string;
    narrative: string;
    isAnonymous: boolean;
    reporterName?: string;
    reporterContact?: string;
  }) => {
    return apiClient.post<ApiResponse & { trackingId: string; status: string }>('/api/grievances', report);
  },

  track: (trackingId: string) => {
    return apiClient.get<ApiResponse<GrievanceRecord>>(`/api/grievances/${encodeURIComponent(trackingId)}`);
  },

  getAll: (token: string, params?: { status?: string; search?: string }) => {
    return apiClient.get<ApiResponse<GrievanceRecord[]>>('/api/admin/grievances', params, token);
  },

  updateStatus: (
    trackingId: string,
    updateData: { status: string; statusDetails: string },
    token: string
  ) => {
    return apiClient.put<ApiResponse>(
      `/api/admin/grievances/${encodeURIComponent(trackingId)}`,
      updateData,
      token
    );
  },

  delete: (trackingId: string, token: string) => {
    return apiClient.delete<ApiResponse>(
      `/api/admin/grievances/${encodeURIComponent(trackingId)}`,
      undefined,
      token
    );
  },
};

/**
 * Activities, Events & Blog Dispatches API
 */
export const activitiesApi = {
  getAll: (params?: { category?: string; search?: string }) => {
    return apiClient.get<ApiResponse<ActivityRecord[]>>('/api/activities', params);
  },

  getById: (id: string) => {
    return apiClient.get<ApiResponse<ActivityRecord>>(`/api/activities/${encodeURIComponent(id)}`);
  },

  getCategories: () => {
    return apiClient.get<ApiResponse<string[]>>('/api/activities/categories');
  },

  create: (activity: Partial<ActivityRecord>, token: string) => {
    return apiClient.post<ApiResponse<ActivityRecord>>('/api/admin/activities', activity, token);
  },

  update: (id: string, activity: Partial<ActivityRecord>, token: string) => {
    return apiClient.put<ApiResponse<ActivityRecord>>(`/api/admin/activities/${encodeURIComponent(id)}`, activity, token);
  },

  delete: (id: string, token: string) => {
    return apiClient.delete<ApiResponse>(`/api/admin/activities/${encodeURIComponent(id)}`, undefined, token);
  },
};

/**
 * Digital ID Card Retrieval & OTP Authentication API
 */
export const idCardApi = {
  lookupAndSendOtp: (data: { uidNumber: string; email?: string; mobile?: string }) => {
    return apiClient.post<ApiResponse & { officer: Officer; expiresAt: number }>('/api/id-cards/lookup', data);
  },

  verifyOtp: (data: { uidNumber: string; otpCode: string }) => {
    return apiClient.post<ApiResponse & { officer: Officer }>('/api/id-cards/verify-otp', data);
  },

  resendOtp: (data: { uidNumber: string; email?: string }) => {
    return apiClient.post<ApiResponse & { expiresAt: number }>('/api/id-cards/resend-otp', data);
  },
};

/**
 * Public Contact Desk API
 */
export const contactApi = {
  sendMessage: (messageData: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) => {
    return apiClient.post<ApiResponse>('/api/contact', messageData);
  },
};

/**
 * Public & Admin Donations / Contributions API
 */
export const donationsApi = {
  record: (donation: {
    donorName: string;
    panNumber?: string;
    donorPhone?: string;
    amount: number;
    fund: string;
    paymentMethod: string;
    utrNumber?: string;
    upiId?: string;
    taxExemptionEligible?: boolean;
  }) => {
    return apiClient.post<ApiResponse & { receiptId: string }>('/api/donations', donation);
  },

  getAll: (token: string) => {
    return apiClient.get<ApiResponse<DonationRecord[]>>('/api/admin/donations', undefined, token);
  },
};

/**
 * Administrative Control Center API
 */
export const adminApi = {
  login: (password: string) => {
    return apiClient.post<ApiResponse & { token: string; permissions: string[] }>('/api/admin/login', { password });
  },

  getStats: (token: string) => {
    return apiClient.get<ApiResponse<{
      officersCount: number;
      applicationsCount: number;
      grievancesCount: number;
      activitiesCount: number;
      donationsTotal: number;
    }>>('/api/admin/stats', undefined, token);
  },

  getSettings: (token: string) => {
    return apiClient.get<ApiResponse<any>>('/api/admin/settings', undefined, token);
  },

  updateSettings: (settings: any, token: string) => {
    return apiClient.post<ApiResponse>('/api/admin/settings', settings, token);
  },

  uploadLogo: (imageBase64: string, token: string) => {
    return apiClient.post<ApiResponse & { url: string }>('/api/upload-logo', { imageBase64 }, token);
  },

  uploadLawPdf: (data: { lawId: string; fileName: string; pdfBase64: string; title: string }, token: string) => {
    return apiClient.post<ApiResponse & { fileUrl: string }>('/api/admin/laws/upload', data, token);
  },

  testDatabase: (token: string, overrides?: { host?: string; port?: number; user?: string; password?: string; database?: string; ssl?: boolean }) => {
    return apiClient.post<ApiResponse>('/api/admin/test-db', overrides, token);
  },

  testSmtp: (token: string, targetEmail?: string) => {
    return apiClient.post<ApiResponse>('/api/admin/test-smtp', { targetEmail }, token);
  },
};

export default apiClient;

