import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { semanticSearchApiClient, UploadEventsResponse } from '@/api/semanticSearch.api';

interface JobStatusResponse {
  job_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  result?: {
    status: string;
    message: string;
  };
  error?: string;
}

const POLL_INTERVAL = 2000; // 2 seconds

const checkJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
  const response = await fetch(`http://localhost:8003/api/jobs/status/${jobId}`);
  if (!response.ok) {
    throw new Error('Failed to check job status');
  }
  return response.json();
};

export const useUploadEvents = () => {
  const { t } = useTranslation();

  const { mutate: triggerUpload, isPending, data } = useMutation<UploadEventsResponse, Error>({
    mutationFn: (): Promise<UploadEventsResponse> => semanticSearchApiClient.triggerEventsUpload(),
    onSuccess: (data) => {
      message.success(t('events.upload.started'));
      // Start polling for job status using the job_id from the response
      if (data.job_id) {
        pollJobStatus(data.job_id);
      }
    },
    onError: (error: Error) => {
      console.error('Error triggering upload:', error);
      message.error(error.message || t('common.errors.something-went-wrong'));
    },
  });

  const pollJobStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const status = await checkJobStatus(jobId);
        
        if (status.status === 'completed') {
          clearInterval(interval);
          message.success(status.result?.message || t('events.upload.success'));
        } else if (status.status === 'failed') {
          clearInterval(interval);
          message.error(status.error || t('events.upload.failed'));
        }
        // If still running, continue polling
      } catch (error) {
        console.error('Error checking job status:', error);
        clearInterval(interval);
        message.error(t('events.upload.status_check_failed'));
      }
    }, POLL_INTERVAL);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  };

  return { 
    triggerUpload, 
    isUploading: isPending,
    jobId: data?.job_id 
  };
};
