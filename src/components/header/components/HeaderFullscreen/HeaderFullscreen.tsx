import React, { useEffect, useRef } from 'react';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { BaseButton } from '@/components/common/BaseButton/BaseButton';
import { RequireFullscreen } from '@/components/common/RequireFullscreen/RequireFullscreen';
import { HeaderActionWrapper } from '../../Header.styles';

export const HeaderFullscreen: React.FC = () => {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    rootRef.current = document.getElementById('root');
  }, []);

  return (
    <RequireFullscreen component={rootRef}>
      {(isFullscreen) => (
        <HeaderActionWrapper>
          <BaseButton
            type={isFullscreen ? 'default' : 'text'}
            icon={
              isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
            }
          />
        </HeaderActionWrapper>
      )}
    </RequireFullscreen>
  );
};
