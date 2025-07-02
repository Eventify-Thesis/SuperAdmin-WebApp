import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useResponsive } from '@/hooks/useResponsive';
import { EventStatus } from '@/constants/enums/event';
import { Button, Modal, message } from 'antd';

export const EventCardActions = ({
  id,
  eventStatus,
  onApprove,
  onDecline,
}: {
  id: string;
  eventStatus: EventStatus;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
}) => {
  if (![EventStatus.PENDING_APPROVAL].includes(eventStatus)) return null;

  const { t } = useTranslation();
  const { isMobile } = useResponsive();

  const confirmAction = ({
    title,
    onConfirm,
    type,
  }: {
    title: string;
    onConfirm: () => void;
    type: 'success' | 'error';
  }) => {
    Modal.confirm({
      title,
      centered: true,
      okText: t('yes'),
      cancelText: t('no'),
      onOk: () => {
        onConfirm();
        if (type === 'success') {
          message.success(t('eventReview.approved'));
        } else {
          message.error(t('eventReview.declined'));
        }
      },
    });
  };

  return (
    <ActionsContainer>
      <ActionItem>
        <StyledButton
          type="primary"
          onClick={() =>
            confirmAction({
              title: t('eventReview.confirmApprove'),
              onConfirm: () => onApprove?.(id),
              type: 'success',
            })
          }
          isMobile={isMobile}
        >
          <ActionText>{t('eventReview.approve')}</ActionText>
        </StyledButton>
      </ActionItem>
      <ActionItem>
        <StyledButton
          danger
          onClick={() =>
            confirmAction({
              title: t('eventReview.confirmDecline'),
              onConfirm: () => onDecline?.(id),
              type: 'error',
            })
          }
          isMobile={isMobile}
        >
          <ActionText>{t('eventReview.decline')}</ActionText>
        </StyledButton>
      </ActionItem>
    </ActionsContainer>
  );
};

interface ActionButtonProps {
  isMobile: boolean;
}
const StyledButton = styled(Button)<ActionButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: ${({ isMobile }) => (isMobile ? '100%' : '120px')};
  min-width: 100px;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  flex-shrink: 0;

  // APPROVE button (custom green)
  &&.ant-btn-primary {
    background-color: #28c76f !important;
    border-color: #28c76f !important;
    color: #fff !important;

    &:hover,
    &:focus {
      background-color: #1e9e58 !important;
      border-color: #1e9e58 !important;
      color: #fff !important;
    }
  }

  // DECLINE button (custom red)
  &&.ant-btn-dangerous {
    background-color: #ff6b6b !important;
    border-color: #ff6b6b !important;
    color: #fff !important;

    &:hover,
    &:focus {
      background-color: #d94141 !important;
      border-color: #d94141 !important;
      color: #fff !important;
    }
  }
`;



const ActionsContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  gap: 1rem;
  flex-wrap: nowrap;
  width: 100%;
`;

const ActionItem = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  min-width: 0;
`;

const ActionText = styled.span`
  font-size: 14px;
  color: #ffffff;
`;
