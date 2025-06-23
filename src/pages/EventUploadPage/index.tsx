import React from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useUploadEvents } from '@/mutations/useUploadEvents';

const { Text } = Typography;

const EventUploadPage: React.FC = () => {
  const { t } = useTranslation();
  const { triggerUpload, isUploading, jobId } = useUploadEvents();

  const handleUpload = () => {
    triggerUpload();
  };

  return (
    <Card title={t('events.upload.title')}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <p>{t('events.upload.description')}</p>
        
        <Space>
          <Button
            type="primary"
            icon={isUploading ? <LoadingOutlined /> : <UploadOutlined />}
            onClick={handleUpload}
            loading={isUploading}
            disabled={isUploading}
          >
            {t('events.upload.button')}
          </Button>
          
          {jobId && (
            <Text type="secondary">
              {t('events.upload.job_id')}: {jobId}
            </Text>
          )}
        </Space>
      </Space>
    </Card>
  );
};

export default EventUploadPage;
