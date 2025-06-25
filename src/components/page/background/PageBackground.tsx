import { Box } from '@mui/material';
import React from 'react';
import { BackgroundConfigItem } from '../../../api/content/types/page';
import { useTenantContext } from '../../../core/contexts/TenantContext';
import { usePageBackground } from './hooks';

interface PageBackgroundProps {
  config: BackgroundConfigItem;
}

export const PageBackground: React.FC<PageBackgroundProps> = ({ config }) => {
  const { tenant } = useTenantContext();
  const pageBackground = usePageBackground(config, tenant);

  if (!pageBackground) {
    return null;
  }

  return (
    <>
      {pageBackground.topColor && (
        <Box
          aria-hidden
          position="absolute"
          top={0}
          left={0}
          right={0}
          height={pageBackground.topColorOffset}
          bgcolor={theme => theme.palette.appColors.incidental['000']}
          zIndex={-5}
        />
      )}
      {pageBackground.topColor && (
        <Box
          aria-hidden
          position="absolute"
          top={0}
          left={0}
          right={0}
          height={pageBackground.topColorOffset}
          bgcolor={pageBackground.topColor}
          zIndex={-5}
        />
      )}
      {pageBackground.baseColor && (
        <Box
          aria-hidden
          position="fixed"
          top={0}
          bottom={0}
          left={0}
          right={0}
          bgcolor={pageBackground.baseColor}
          zIndex={-6}
        />
      )}
    </>
  );
};
