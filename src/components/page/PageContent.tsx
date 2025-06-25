import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { PageMenuBlock } from '..';
import { CmsPage, PageContentValues } from '../../api/content/types/page';
import { CmsTenant } from '../../api/content/types/tenant';
import { shouldReduceSpaceBetweenCmsBlocks } from '../../business/cms-spacing';
import { parseContent } from '../../cms/parse-cms';
import { useBereavementSessionWarning } from '../../core/contexts/bereavement/hooks';
import { useMixpanelTrackerSession } from '../../core/hooks/useMixpanelTracker';
import { usePreventDuplicateSession } from '../../core/hooks/usePreventDuplicateSession';
import { useScroll } from '../../core/hooks/useScroll';
import { mixpanelTrackPageLoad } from '../../core/mixpanel-tracker';
import { useRouter } from '../../core/router';

interface Props {
  page: CmsPage | null;
  tenant: CmsTenant | null;
}

export const PageContent: React.FC<Props> = ({ page, tenant }) => {
  const { scrollTop, scrollTo } = useScroll();
  const router = useRouter();
  const [mixpanelSession] = useMixpanelTrackerSession();

  useBereavementSessionWarning();
  usePreventDuplicateSession();
  useEffect(() => {
    const anchor = router.asPath.split('#')[1];
    anchor ? scrollTo(anchor) : scrollTop();
    mixpanelTrackPageLoad({
      PageKey: page?.pageKey.value,
      $referrer: mixpanelSession.previousPage,
      Scroll: mixpanelSession.scroll,
    });
  }, [page, router.asPath]);

  if (!page) {
    return null;
  }

  const pageMenu = page.pageMenu?.value;
  const hideBackButton = page.journeyHideBackButton?.value ?? false;
  const isJourneyPage = !!page.journeyType?.value?.selection;
  const pageHeader = page.pageHeader?.value;
  const backPageKey = page.backPageKey?.value;
  const journeyIndicatorBlock = page.content.values?.find(c => c.type === 'Journey stage indicator');
  const shouldInsertBackByPageKeyButton = backPageKey && (!pageHeader || !!journeyIndicatorBlock);
  const shouldInsertBackButton = isJourneyPage && !hideBackButton && !backPageKey;
  const blocksList = (
    [
      journeyIndicatorBlock,
      shouldInsertBackButton && createShallowContentItem('back_button', 'back'),
      shouldInsertBackByPageKeyButton && createShallowContentItem('back_button_by_page_key', 'back'),
      pageHeader && createShallowContentItem('header', 'header'),
      ...(page.content.values?.filter(block => block.type !== 'Journey stage indicator') ?? []),
    ] as PageContentValues[]
  ).filter(block => !!block?.elements);

  const contentBlocks = parseContent(blocksList, page, tenant, router.parsedQuery)
    .map((block, index) =>
      block ? (
        <Grid item xs={12} mb={shouldReduceSpaceBetweenCmsBlocks(index, blocksList) ? -6 : 0} key={index}>
          {block}
        </Grid>
      ) : null,
    )
    .filter(Boolean);

  return (
    <Grid container data-testid="page-content" spacing={12}>
      {pageMenu && (
        <Grid item xs={12} md={3}>
          <PageMenuBlock id={pageMenu.type} items={pageMenu.elements.pageMenuItem?.values ?? []} />
        </Grid>
      )}
      {pageMenu ? (
        <Grid container item xs={12} md={9} pt={10} spacing={12}>
          {contentBlocks}
        </Grid>
      ) : (
        contentBlocks
      )}
    </Grid>
  );
};

const createShallowContentItem = (type: string, name: string): PageContentValues => ({ name, type, elements: {} });
