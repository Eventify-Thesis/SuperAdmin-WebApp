import React from 'react';
import * as S from './PageLogo.styles';
import logo from '@/assets/logo.png';
import { useAppSelector } from '@/hooks/reduxHooks';

export const SiderLogo: React.FC = () => {

  const theme = useAppSelector((state) => state.theme.theme);

  const img = theme === 'light' ? logo : logo;

  return (
    <S.SiderLogoDiv>
      <S.SiderLogoLink to="/">
        <img src={img} alt="Lightence" width={48} height={48} />
        <S.BrandSpan>Super Admin Center</S.BrandSpan>
      </S.SiderLogoLink>
    </S.SiderLogoDiv>
  );
};
