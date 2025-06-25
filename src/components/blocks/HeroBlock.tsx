import { Box, Grid } from '@mui/material';
import { CmsPage } from '../../api/content/types/page';
import { openInNewWindow } from '../../business/navigation';
import { parseContent } from '../../cms/parse-cms';
import { useTenantContext } from '../../core/contexts/TenantContext';
import { useCmsAsset } from '../../core/hooks/useCmsAsset';
import { useRouter } from '../../core/router';

interface Props {
  id?: string;
  page: CmsPage | null;
}

const HERO_HEIGHT: React.ComponentProps<typeof Grid>['height'] = { xs: '160px', md: '400px' };

export const HeroBlock: React.FC<Props> = ({ id, page }) => {
  const router = useRouter();
  const { tenant } = useTenantContext();
  const hero = page?.heroBlocks?.values?.[0];
  const heroImage = hero?.elements?.heroImage;
  const image = useCmsAsset(heroImage?.url);
  const heroElement = hero?.elements?.heroContent?.value;

  if (!image && !hero && !heroElement) return null;

  return (
    <Box id={id} height={{ xs: 'auto', md: HERO_HEIGHT['md'] }} width="100%">
      <Box
        onClick={handleImageClick}
        data-testid="hero-block"
        position={{ xs: 'relative', md: 'absolute' }}
        height={HERO_HEIGHT}
        left={0}
        right={0}
        zIndex={heroImage?.link?.url ? 1 : -1}
        sx={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', cursor: 'pointer' }}
      >
        <span role="img" aria-label={heroImage?.asset?.altText} />
      </Box>
      <Grid
        container
        mx={theme => ({ md: theme.sizes.contentPaddingX })}
        width="100%"
        height="100%"
        maxWidth={theme => theme.sizes.contentWidth}
        alignItems={{ md: 'center' }}
        justifyContent={{ md: 'flex-start' }}
      >
        {heroElement &&
          page &&
          parseContent([heroElement], page, tenant)
            .map((block, index) =>
              block ? (
                <Grid
                  item
                  key={index}
                  maxWidth={{ xs: 'unset', md: 560, lg: 670 }}
                  sx={{ '> div': { p: 8, borderRadius: { xs: 0, md: '4px' } } }}
                >
                  {block}
                </Grid>
              ) : null,
            )
            .filter(Boolean)}
      </Grid>
    </Box>
  );

  function handleImageClick() {
    heroImage?.link?.url &&
      (heroImage?.link?.target === '_blank' ? openInNewWindow(heroImage.link.url) : router.push(heroImage.link.url));
  }
};
