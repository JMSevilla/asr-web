import Image from 'next/image';
import React from 'react';
import { CmsTenant } from '../../api/content/types/tenant';
import { externalImageLoader } from '../../business/images';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useCachedCmsAsset } from '../../core/hooks/useCmsAsset';

interface Props {
  id: string;
  logo?: NonNullable<NonNullable<CmsTenant['footerLogo']>['renditions']>['default'];
}

export const FooterLogo: React.FC<Props> = ({ id, logo }) => {
  const { labelByKey } = useGlobalsContext();
  const image = useCachedCmsAsset(logo?.url);

  if (!image) {
    return null;
  }

  return (
    <Image
      id={id}
      data-testid="header_logo_image"
      src={image}
      loader={externalImageLoader}
      width={logo?.width ?? 160}
      height={logo?.height ?? 50}
      alt={labelByKey('tenant_footer_logo_alt')}
    />
  );
};
