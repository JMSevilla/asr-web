import { Box } from '@mui/material';
import Image from 'next/image';
import { CmsTenant } from '../../api/content/types/tenant';
import { externalImageLoader } from '../../business/images';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useCachedCmsAsset } from '../../core/hooks/useCmsAsset';
import { useResolution } from '../../core/hooks/useResolution';

interface Props {
  tenant: CmsTenant | null;
  disableNavigation?: boolean;
}

export const CobrandingLogo: React.FC<Props> = ({ tenant, disableNavigation = false }) => {
  const { isMobile } = useResolution();
  const { classifierByKey, labelByKey } = useGlobalsContext();
  const logo = isMobile ? tenant?.mobileLogo?.renditions?.default : tenant?.tenantLogo?.renditions?.default;
  const cachedAccessKey = useCachedAccessKey();
  const classifiers = cachedAccessKey.data && classifierByKey('co-branding-images');
  const cursorIcon = disableNavigation ? 'default' : 'pointer';
  const cobrandingLogo = classifiers?.find(logo => {
    // Checks logo value against scheme and category (format 'scheme-category'), allowing '*' as universal category.
    const [logoCode, logoCategory] = logo.value?.split('-') || [];
    const [schemeCode, category] = cachedAccessKey.data?.schemeCodeAndCategory?.split('-') || [];

    const codeEquals = logoCode === schemeCode;
    const categoryEquals = logoCategory === category || logoCategory === '*';

    return codeEquals && categoryEquals;
  });

  const cobrandingLogoSrc = useCachedCmsAsset(cobrandingLogo?.label);

  if (!tenant || !logo || !cobrandingLogoSrc) {
    return null;
  }

  return (
    <Box
      position="relative"
      sx={{ cursor: cursorIcon, borderLeft: '1px solid', borderColor: 'divider', ml: 5, pl: 5 }}
      width={logo?.width}
      height={logo?.height}
      role="button"
      aria-label={labelByKey('cobranding_logo_aria_label')}
    >
      <Image
        data-testid="cobranding_logo_image"
        src={cobrandingLogoSrc}
        loader={externalImageLoader}
        alt={labelByKey('tenant_logo_alt')}
        key={`${isMobile ? 'mobile' : 'desktop'}-logo`}
        height={isMobile ? 28 : logo?.height || 46}
        width={logo?.width || 100}
        style={{ objectFit: 'contain', objectPosition: 'center', width: 'auto' }}
      />
    </Box>
  );
};
