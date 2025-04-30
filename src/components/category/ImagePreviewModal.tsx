import React from 'react';
import { Modal } from 'antd';

interface Props {
  open: boolean;
  onCancel: () => void;
  title: string;
  imageUrl: string;
}

export const ImagePreviewModal: React.FC<Props> = ({
  open,
  onCancel,
  title,
  imageUrl,
}) => (
  <Modal open={open} title={title} footer={null} onCancel={onCancel}>
    <img alt="preview" style={{ width: '100%' }} src={imageUrl} />
  </Modal>
);
