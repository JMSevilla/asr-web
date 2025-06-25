import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { CmsTenant } from '../../api/content/types/tenant';
import { externalImageLoader } from '../../business/images';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useCachedCmsAsset } from '../../core/hooks/useCmsAsset';
import { useResolution } from '../../core/hooks/useResolution';

interface Props {
  tenant: CmsTenant | null;
  useRawLogoUrl?: boolean;
  disableNavigation?: boolean;
}

export const HeaderLogo: React.FC<Props> = ({ tenant, useRawLogoUrl, disableNavigation = false }) => {
  const { isMobile } = useResolution();
  const { labelByKey } = useGlobalsContext();
  const logo = isMobile ? tenant?.mobileLogo?.renditions?.default : tenant?.tenantLogo?.renditions?.default;
  const mobileLogoSrc = useCachedCmsAsset(tenant?.mobileLogo?.renditions?.default?.url);
  const desktopLogoSrc = useCachedCmsAsset(tenant?.tenantLogo?.renditions?.default?.url);
  const imageSrc = useRawLogoUrl ? logo?.url : isMobile ? mobileLogoSrc : desktopLogoSrc;
  const cursorIcon = disableNavigation ? 'default' : 'pointer';
  if (!tenant) {
    return null;
  }

  return (
    <Box
      position="relative"
      sx={{ cursor: cursorIcon }}
      width={logo?.width}
      height={logo?.height}
      role="button"
      aria-label={labelByKey('header_logo_aria_label')}
    >
      {logo && imageSrc ? (
        <Image
          data-testid="header_logo_image"
          src={imageSrc || ''}
          loader={externalImageLoader}
          alt={labelByKey('tenant_logo_alt')}
          key={`${isMobile ? 'mobile' : 'desktop'}-logo`}
          height={isMobile ? 28 : logo?.height || 46}
          width={logo?.width || 100}
          style={{ objectFit: 'contain', objectPosition: 'center', width: 'auto' }}
        />
      ) : (
        <Typography
          variant="h3"
          component="span"
          fontWeight="bold"
          color="primary"
          noWrap
          fontSize={theme => ({
            xs: theme.typography.h6.fontSize,
            sm: theme.typography.h4.fontSize,
            md: theme.typography.h3.fontSize,
          })}
        >
          {tenant.headerText.value}
        </Typography>
      )}
    </Box>
  );
};
