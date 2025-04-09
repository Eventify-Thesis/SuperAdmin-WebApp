import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useResponsive } from '@/hooks/useResponsive';
import { EventStatus } from '@/constants/enums/event';
import { Button, Popconfirm, message } from 'antd';

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
  const { t } = useTranslation();
  const { isMobile } = useResponsive();

  const handleApprove = () => {
    if (onApprove) onApprove(id);
    else message.success(t('eventReview.approved'));
  };

  const handleDecline = () => {
    if (onDecline) onDecline(id);
    else message.error(t('eventReview.declined'));
  };

  // Show actions only if event is not yet verified
  if (eventStatus !== EventStatus.PENDING_APPROVAL) return null;

  return (
    <ActionsContainer>
      <ActionItem>
        <StyledButton type="primary" onClick={handleApprove} isMobile={isMobile}>
          {<ActionText>{t('eventReview.approve')}</ActionText>}
        </StyledButton>
      </ActionItem>
      <ActionItem>
        <Popconfirm
          title={t('eventReview.confirmDecline')}
          onConfirm={handleDecline}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <StyledButton danger isMobile={isMobile}>
            {<ActionText>{t('eventReview.decline')}</ActionText>}
          </StyledButton>
        </Popconfirm>
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
  gap: ${({ isMobile }) => (isMobile ? '2px' : '6px')};
  width: 100%;
  padding: 10px 0;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;

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
  justify-content: center;
  align-items: center;
  background-color: #414652;
  padding: 10px 20px;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionItem = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const ActionText = styled.span`
  font-size: 14px;
  color: #ffffff;
`;
