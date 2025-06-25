import { Box, Typography, useTheme } from '@mui/material';
import { Accordion, ListLoader, ParsedHtml } from '..';
import { SelectionValue } from '../../api/content/types/common';
import { CmsPage } from '../../api/content/types/page';
import { NA_SYMBOL } from '../../business/constants';
import { InterpolationTokens } from '../../cms/types';
import { DATA_TOKENS_REGEX, useDataReplacerApi } from '../../core/hooks/useDataReplacerApi';
interface Props {
  id?: string;
  tokens?: InterpolationTokens;
  blockHeader?: NonNullable<NonNullable<CmsPage['content']>['values']>[number]['elements']['blockHeader'];
  header?: string;
  subHeader?: string;
  showInAccordion?: SelectionValue['value'];
  html?: string;
  backgroundColor?: string | null;
  smallerFonts?: boolean;
  insideHeroBlock?: boolean;
  sourceUrl?: string;
  errorContent?: string;
  alternateTableStyle?: string;
}

export const TextBlock: React.FC<Props> = ({
  id,
  tokens,
  blockHeader,
  header,
  subHeader,
  html,
  backgroundColor,
  showInAccordion,
  smallerFonts,
  insideHeroBlock,
  sourceUrl,
  errorContent,
  alternateTableStyle,
}) => {
  const theme = useTheme();
  const replacer = useDataReplacerApi(sourceUrl);

  if (sourceUrl && replacer.loading) {
    return <ListLoader id={id} loadersCount={1} data-testid="text-block-loader" />;
  }

  const enrichedHtml = processHtml(html);

  if (showInAccordion) {
    return (
      <Accordion
        id={id}
        header={blockHeader?.value?.elements.labelText.value ?? header}
        html={enrichedHtml}
        opened={showInAccordion.selection === 'Open'}
      />
    );
  }

  return (
    <Box
      id={id}
      sx={{
        backgroundColor,
        color: theme.palette.appColors.primary === backgroundColor ? theme.palette.common.white : 'unset',
      }}
      data-testid="content-html-block"
      {...replacer.elementProps(id)}
    >
      {(blockHeader?.value?.elements.labelText.value || header) && (
        <Typography component={insideHeroBlock ? 'h1' : 'h2'} variant="h2" mb={subHeader || enrichedHtml ? 6 : 0}>
          {blockHeader?.value?.elements.labelText.value ?? header}
        </Typography>
      )}
      {subHeader && (
        <Typography variant="h3" mb={enrichedHtml ? 6 : 0}>
          {subHeader}
        </Typography>
      )}
      {enrichedHtml && (
        <ParsedHtml
          html={enrichedHtml}
          tokens={tokens}
          smallerFonts={smallerFonts}
          alternateTableStyle={alternateTableStyle}
        />
      )}
    </Box>
  );

  function processHtml(html?: string) {
    if (!sourceUrl || !html) {
      return html;
    }

    if (replacer.error && errorContent) {
      return errorContent;
    }

    if (!replacer.loading && html) {
      const PATH_REGEX = /\[\[data-.*:(.*)\]\]/;
      const fieldPaths = html.match(DATA_TOKENS_REGEX)?.map(token => token.match(PATH_REGEX)?.[1] as string) ?? [];

      const hasMissingData = fieldPaths.some(fieldPath => {
        const value = replacer.getRawValue(fieldPath);
        return value === null || value === NA_SYMBOL;
      });

      return hasMissingData && errorContent ? errorContent : replacer.replaceDataInText(html);
    }

    return html;
  }
};
