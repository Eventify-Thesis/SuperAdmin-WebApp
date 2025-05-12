import React from 'react';
import { List, Button, Spin } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  ListWrapper,
  StyledCard,
  CardBody,
  Thumbnail,
  CategoryDetails,
  BoldText,
  SectionTitle,
} from './CategoryList.styles';

interface Category {
  code: string;
  nameEn: string;
  nameVi: string;
  image: string;
}

interface Props {
  categories: Category[];
  isLoading: boolean;
  onPreview: (imageUrl: string, title: string) => void;
  onDelete: (category: Category) => void;
  onReload: () => void;
}

export const CategoryList: React.FC<Props> = ({
  categories,
  isLoading,
  onPreview,
  onDelete,
  onReload,
}) => {
  const { t } = useTranslation();

  return (
    <ListWrapper>
      <SectionTitle>
        {t('admin.category.current_categories')}
        {' '}
        {!isLoading && (
          <Button 
            type="text" 
            icon={<ReloadOutlined />} 
            onClick={onReload}
            style={{ color: 'white', fontSize: '25px', fontWeight: 'bold' }}
          />
        )}
      </SectionTitle>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <List
          dataSource={categories}
          renderItem={(item) => (
            <List.Item style={{ justifyContent: 'center' }}>
              <StyledCard hoverable>
                <CardBody>
                  <Thumbnail
                    src={item.image}
                    alt={item.nameEn}
                    onClick={() => onPreview(item.image, item.nameEn)}
                  />
                  <CategoryDetails>
                    <BoldText>
                      {t('admin.category.code')}: {item.code}
                    </BoldText>
                    <div>
                      {t('admin.category.name_en')}: {item.nameEn}
                    </div>
                    <div>
                      {t('admin.category.name_vi')}: {item.nameVi}
                    </div>
                  </CategoryDetails>
                  <Button
                    danger
                    type="text"
                    icon={<DeleteOutlined style={{ fontSize: '18px' }} />}
                    onClick={() => onDelete(item)}
                  />
                </CardBody>
              </StyledCard>
            </List.Item>
          )}
        />
      )}
    </ListWrapper>
  );
};
