import React from 'react';
import * as S from './MainSider/MainSider.styles';
import { RightOutlined } from '@ant-design/icons';
import { useResponsive } from '@/hooks/useResponsive';
import logo from '@/assets/logo.png';
import { useAppSelector } from '@/hooks/reduxHooks';

interface SiderLogoProps {
  isSiderCollapsed: boolean;
  toggleSider: () => void;
}
export const SiderLogo: React.FC<SiderLogoProps> = ({
  isSiderCollapsed,
  toggleSider,
}) => {
  const { tabletOnly } = useResponsive();

  const theme = useAppSelector((state) => state.theme.theme);

  const img = theme === 'light' ? logo : logo;

  return (
    <S.SiderLogoDiv>
      <S.SiderLogoLink to="/">
        <img src={img} alt="Lightence" width={48} height={48} />
        <S.BrandSpan>Super Admin Center</S.BrandSpan>
      </S.SiderLogoLink>
      {tabletOnly && (
        <S.CollapseButton
          shape="circle"
          size="small"
          $isCollapsed={isSiderCollapsed}
          icon={<RightOutlined rotate={isSiderCollapsed ? 0 : 180} />}
          onClick={toggleSider}
        />
      )}
    </S.SiderLogoDiv>
  );
};
