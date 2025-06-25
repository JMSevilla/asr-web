import Image from 'next/image';
import { externalImageLoader } from '../../business/images';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useTenantContext } from '../../core/contexts/TenantContext';
import { useCachedCmsAsset } from '../../core/hooks/useCmsAsset';

interface Props {
  width: number;
  height: number;
}

export const ChatBotLogo: React.FC<Props> = ({ width, height }) => {
  const { labelByKey } = useGlobalsContext();
  const { tenant } = useTenantContext();
  const logo = tenant?.whiteLogo?.renditions?.default;
  const image = useCachedCmsAsset(logo?.url);

  if (!image) {
    return null;
  }

  return (
    <Image
      aria-hidden="true"
      data-testid="company-logo"
      src={image}
      loader={externalImageLoader}
      height={height}
      width={logo?.height && logo.width ? (height / logo.height) * logo.width : width}
      alt={tenant?.footerLogo?.asset.altText || labelByKey('virtual_assistant_company_logo_alt')}
    />
  );
};
