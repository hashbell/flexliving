import axios from 'axios';
import { INormalizedReview, IDashboardData, IPropertyPerformance, IApiResponse } from '../types/review';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class ApiService {
  // Reviews API
  static async fetchReviews(): Promise<INormalizedReview[]> {
    const response = await api.get<IApiResponse<INormalizedReview[]>>('/api/reviews/hostaway');
    return response.data.data;
  }

  static async fetchPropertyReviews(propertyName: string): Promise<IPropertyPerformance> {
    const response = await api.get<IApiResponse<IPropertyPerformance>>(
      `/api/reviews/property/${encodeURIComponent(propertyName)}`
    );
    return response.data.data;
  }

  static async fetchApprovedReviews(): Promise<INormalizedReview[]> {
    const response = await api.get<IApiResponse<INormalizedReview[]>>('/api/reviews/approved');
    return response.data.data;
  }

  static async updateReviewApproval(reviewId: number, isApproved: boolean): Promise<boolean> {
    const response = await api.post<IApiResponse<{ success: boolean; reviewId: number; isApproved: boolean }>>(
      `/api/reviews/${reviewId}/approve`,
      { isApproved }
    );
    return response.data.data.success;
  }

  static async fetchDashboardData(): Promise<IDashboardData> {
    const response = await api.get<IApiResponse<IDashboardData>>('/api/reviews/dashboard');
    return response.data.data;
  }

  static async fetchFilteredReviews(filters: {
    minRating?: number;
    maxRating?: number;
    channel?: string;
    propertyName?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
  }): Promise<{ reviews: INormalizedReview[]; stats: any; count: number }> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get<IApiResponse<{ reviews: INormalizedReview[]; stats: any; count: number }>>(
      `/api/reviews/filter?${params.toString()}`
    );
    return response.data.data;
  }

  // Health check
  static async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    const response = await api.get('/health');
    return response.data;
  }
}

export default ApiService;
