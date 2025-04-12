import React from 'react';
import {
  ModalContent,
  ModalImageWrapper,
  ModalImage,
  ModalTitle,
  ModalSubtitle,
} from './DeleteModal.styles';
import rethink from '@/assets/images/rethink.jpg'; // make sure this path is correct
import { useTranslation } from 'react-i18next';

export const DeleteModal: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ModalContent>
      <ModalImageWrapper>
        <ModalImage src={rethink} alt="rethink" />
      </ModalImageWrapper>
      <ModalTitle>{t('category.delete_modal_title')}</ModalTitle>
      <ModalSubtitle>{t('category.delete_modal_subtitle')}</ModalSubtitle>
    </ModalContent>
  );
};
