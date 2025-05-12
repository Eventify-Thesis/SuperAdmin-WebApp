import React, { useState } from 'react';
import { UploadFile } from 'antd/es/upload/interface';
import { PageTitle } from '@/components/common/PageTitle/PageTitle';
import { useGetCategories } from '@/queries/useCategoryQueries';
import { useDeleteCategory } from '@/mutations/useDeleteCategory';
import { message, Modal } from 'antd';
import { CategoryForm } from '@/components/category/CategoryForm';
import { CategoryList } from '@/components/category/CategoryList/CategoryList';
import { DeleteModal } from '@/components/category/DeleteModal/DeleteModal';
import { ImagePreviewModal } from '@/components/category/ImagePreviewModal';
import { PageContainer, FormWrapper } from '@/styles/AdminCategory.styles';
import { useTranslation } from 'react-i18next';
import { BASE_COLORS } from '@/styles/themes/constants';

const AdminCategoryPage: React.FC = () => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const { data: categories = [], isLoading, refetch } = useGetCategories();
  const { mutate: deleteCategory } = useDeleteCategory();

  const handlePreview = (imageUrl: string, title: string) => {
    setPreviewImage(imageUrl);
    setPreviewTitle(title);
    setPreviewOpen(true);
  };

  const showDeleteConfirm = (category: any) => {
    Modal.confirm({
      icon: null,
      title: null,
      centered: true,
      maskClosable: true,
      content: <DeleteModal />,
      okText: t('category.confirm_ok'),
      cancelText: t('category.confirm_cancel'),
      okButtonProps: {
        style: {
          backgroundColor: 'var(--primary-color)',
          borderColor: 'var(--primary-color)',
          color: BASE_COLORS.black,
        },
      },
      onOk: () => {
        deleteCategory(category.code, {
          onSuccess: () => {
            message.success(t('admin.category.delete_success'));
            refetch();
          },
          onError: () => message.error(t('admin.category.delete_error')),
        });
      },
    });

  };

  return (
    <PageContainer>
      <PageTitle>{t('admin.category.title')}</PageTitle>
      <FormWrapper>
        <CategoryForm
          fileList={fileList}
          setFileList={setFileList}
          refetch={refetch}
        />
        <ImagePreviewModal
          open={previewOpen}
          onCancel={() => setPreviewOpen(false)}
          imageUrl={previewImage}
          title={previewTitle}
        />
        <CategoryList
          categories={categories}
          isLoading={isLoading}
          onPreview={handlePreview}
          onDelete={showDeleteConfirm}
          onReload={refetch}
        />
      </FormWrapper>
    </PageContainer>
  );
};

export default AdminCategoryPage;
