import React from 'react';
import { Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import { uploadFile } from '@/services/fileUpload.service';
import { useAddCategory } from '@/mutations/useAddCategory';
import { BASE_COLORS } from '@/styles/themes/constants';

interface Props {
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  refetch: () => void;
}

export const CategoryForm: React.FC<Props> = ({ fileList, setFileList, refetch }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { mutate: addCategoryMutation, isLoading } = useAddCategory();

  const uploadProps = {
    beforeUpload: () => false,
    listType: 'picture-card',
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
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label={t('admin.category.code')}
        name="code"
        rules={[{ required: true, message: t('admin.category.code_required') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t('admin.category.name_en')}
        name="nameEn"
        rules={[{ required: true, message: t('admin.category.name_en_required') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t('admin.category.name_vi')}
        name="nameVi"
        rules={[{ required: true, message: t('admin.category.name_vi_required') }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={t('admin.category.image')} required>
        <Upload {...uploadProps}>
          {fileList.length < 1 && (
            <div><UploadOutlined /> {t('admin.category.upload_image')}</div>
          )}
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          block
          style={{ backgroundColor: '#FFC107', color: BASE_COLORS.black }}
        >
          {t('admin.category.submit')}
        </Button>
      </Form.Item>
    </Form>
  );
};
