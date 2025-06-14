import React from 'react';
import { Form, Input, Upload, Button, message, Card, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { uploadFile } from '@/services/fileUpload.service';
import { useAddCategory } from '@/mutations/useAddCategory';
import { BASE_COLORS } from '@/styles/themes/constants';

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 16px;
  
  .ant-form-item-label {
    padding-bottom: 4px;
    
    > label {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      
      &::before {
        display: inline-block;
        margin-right: 4px;
        color: #ff4d4f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
      }
    }
  }
`;

const StyledUpload = styled(Upload)`
  .ant-upload.ant-upload-select-picture-card {
    width: 128px;
    height: 128px;
    margin-right: 8px;
    margin-bottom: 8px;
    text-align: center;
    vertical-align: top;
    background-color: #fafafa;
    border: 1px dashed #d9d9d9;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.3s;
    
    &:hover {
      border-color: ${BASE_COLORS.primary};
    }
  }
`;

const SubmitButton = styled(Button)`
  height: 40px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
  }
`;


interface Props {
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  refetch: () => void;
}

export const CategoryForm: React.FC<Props> = ({ fileList, setFileList, refetch }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { mutate: addCategoryMutation, isLoading } = useAddCategory();

    const uploadProps: UploadProps = {
    beforeUpload: () => false,
    listType: 'picture-card' as const,
    fileList,
    onChange: ({ fileList: newList }: { fileList: UploadFile[] }) =>
      setFileList(newList),
  };

  const onFinish = async (values: any) => {
    if (fileList.length === 0 || !fileList[0].originFileObj) {
      message.error(t('admin.category.image_required', 'Image is required'));
      return;
    }

    try {
      const imageUrl = await uploadFile(fileList[0].originFileObj as RcFile);

      const categoryData = {
        ...values,
        image: imageUrl,
      };

      addCategoryMutation(
        { categoryData },
        {
          onSuccess: () => {
            message.success(t('admin.category.add_success'));
            form.resetFields();
            setFileList([]);
            refetch();
          },
          onError: () => {
            message.error(t('admin.category.add_error'));
          },
        }
      );
    } catch {
      message.error(t('admin.category.add_error'));
    }
  };

  return (
    <StyledCard title={t('admin.category.add_category')}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <StyledFormItem
            label={t('admin.category.code')}
            name="code"
            rules={[{ required: true, message: t('admin.category.code_required') }]}
          >
            <Input size="large" placeholder={t('admin.category.code')} />
          </StyledFormItem>
          
          <StyledFormItem
            label={t('admin.category.name_en')}
            name="nameEn"
            rules={[{ required: true, message: t('admin.category.name_en_required') }]}
          >
            <Input size="large" placeholder={t('admin.category.name_en')} />
          </StyledFormItem>
          
          <StyledFormItem
            label={t('admin.category.name_vi')}
            name="nameVi"
            rules={[{ required: true, message: t('admin.category.name_vi_required') }]}
          >
            <Input size="large" placeholder={t('admin.category.name_vi')} />
          </StyledFormItem>
          
          <StyledFormItem label={t('admin.category.image')} required>
            <StyledUpload {...uploadProps}>
              {fileList.length < 1 ? (
                <div>
                  <PlusOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px' }}>{t('admin.category.upload_image')}</div>
                </div>
              ) : null}
            </StyledUpload>
          </StyledFormItem>
          
          <Form.Item style={{ marginTop: '24px' }}>
            <SubmitButton
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              style={{ 
                backgroundColor: '#FFC107', 
                color: BASE_COLORS.black,
                border: 'none',
                fontSize: '16px'
              }}
            >
              {t('admin.category.submit')}
            </SubmitButton>
          </Form.Item>
        </Space>
      </Form>
    </StyledCard>
  );
};
