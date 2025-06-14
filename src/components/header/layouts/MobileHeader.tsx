import React from 'react';
import { NotificationsDropdown } from '../components/notificationsDropdown/NotificationsDropdown';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
import * as S from '../Header.styles';
import { BaseRow } from '@/components/common/BaseRow/BaseRow';
import { BaseCol } from '@/components/common/BaseCol/BaseCol';

import { UserButton } from '@clerk/clerk-react';
interface MobileHeaderProps {
  toggleSider: () => void;
  isSiderOpened: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  toggleSider,
  isSiderOpened,
}) => {
  return (
    <BaseRow justify="space-between" align="middle" style={{ height: '100%' }}>
      <BaseCol style={{ display: 'flex', alignItems: 'center' }}>
        <UserButton showName={false} appearance={{}} />
      </BaseCol>

      <BaseCol>
        <BaseRow gutter={16} align="middle" justify="end" style={{ height: '100%' }}>
          <BaseCol style={{ display: 'flex', alignItems: 'center' }}>
            <SettingsDropdown />
          </BaseCol>
          <S.BurgerCol style={{ display: 'flex', alignItems: 'center' }}>
            <S.MobileBurger onClick={toggleSider} isCross={isSiderOpened} />
          </S.BurgerCol>
        </BaseRow>
      </BaseCol>
    </BaseRow>
  );
};
