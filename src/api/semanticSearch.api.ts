import axios, { AxiosError } from 'axios';
import { ApiError } from '@/api/ApiError';

export interface UploadEventsResponse {
  job_id: string;
  status: string;
  message: string;
  check_status: string;
}

const semanticSearchApi = axios.create({
  baseURL: import.meta.env.VITE_SEMANTIC_SEARCH_API_URL
    ? `${import.meta.env.VITE_SEMANTIC_SEARCH_API_URL}`
    : 'http://localhost:8003',
});

interface ErrorResponse {
  message: string;
  [key: string]: any;
}

semanticSearchApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorMessage = (error.response?.data as ErrorResponse)?.message || error.message;
    throw new ApiError(
      errorMessage,
      error.response?.data,
    );
  },
);

export const triggerEventsUpload = async (): Promise<UploadEventsResponse> => {
  const response = await semanticSearchApi.post<UploadEventsResponse>('/api/jobs/upload-events');
  return response.data;
};

export const semanticSearchApiClient = {
  triggerEventsUpload,
};
