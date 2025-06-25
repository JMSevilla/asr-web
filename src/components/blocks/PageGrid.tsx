import { Grid } from '@mui/material';
import { CmsPage, PageContentValues } from '../../api/content/types/page';
import { CmsTenant } from '../../api/content/types/tenant';
import { parseContent } from '../../cms/parse-cms';
import { useRouter } from '../../core/router';

interface Props {
  contentBlocksList?: PageContentValues[];
  gridKey?: string;
  columns?: number;
  gridItemsBackgroundColor?: string;
  rows?: number;
  page: CmsPage | null;
  tenant: CmsTenant | null;
}

export const PageGrid: React.FC<Props> = ({
  contentBlocksList,
  columns = 3,
  gridKey,
  page,
  tenant,
  rows,
  gridItemsBackgroundColor,
}) => {
  const router = useRouter();

  if (!contentBlocksList || !page || !tenant) return null;

  const updatedBlockList = contentBlocksList.map(block => {
    const defaultColor = block?.elements?.backgroundColour?.value;
    const color = defaultColor || gridItemsBackgroundColor;

    return {
      ...block,
      elements: {
        ...block.elements,
        backgroundColour: color ? { value: color } : undefined,
      },
    };
  });

  let contentBlocks = parseContent(updatedBlockList, page, tenant, router.parsedQuery)
    .map((block, index) => (block ? <Grid key={index}>{block}</Grid> : null))
    .filter(Boolean);

  if (rows !== undefined && rows !== 0) {
    contentBlocks = contentBlocks.slice(0, rows * columns);
  }

  return (
    <Grid
      display="grid"
      gridTemplateColumns={`repeat(auto-fit, minmax(306px, 1fr))`}
      gap={6}
      id={gridKey}
      data-testid={gridKey}
    >
      {contentBlocks}
    </Grid>
  );
};
