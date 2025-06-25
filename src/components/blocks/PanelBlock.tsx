import { Box, Stack, Typography } from '@mui/material';
import {
  CmsPage,
  ColumnAlignment,
  PanelColumn,
  PanelLayoutSelection,
  PanelSideSelection,
} from '../../api/content/types/page';
import { CmsTenant } from '../../api/content/types/tenant';
import { shouldReduceSpaceBetweenCmsBlocks } from '../../business/cms-spacing';
import { parseBackgroundColor, parseContent } from '../../cms/parse-cms';
import { useResolution } from '../../core/hooks/useResolution';
import { useRouter } from '../../core/router';

interface Props {
  id?: string;
  panelKey?: string;
  page: CmsPage;
  tenant: CmsTenant | null;
  header: NonNullable<NonNullable<CmsPage['content']>['values']>[number]['elements']['header'];
  columns: NonNullable<NonNullable<CmsPage['content']>['values']>[number]['elements']['columns'];
  layout: NonNullable<NonNullable<CmsPage['content']>['values']>[number]['elements']['layout'];
  reverseStacking: NonNullable<NonNullable<CmsPage['content']>['values']>[number]['elements']['reverseStacking'];
  role?: string;
}

const FULL_WIDTH_CONTENT_TYPES = [
  'Panel',
  'Button',
  'Button clip',
  'Content HTML block',
  'retirement_app_file_download',
  'personal_details_retirement',
  'bank_details_form',
  'phone_confirmation_form',
  'email_confirmation_form',
  'lta_used_percentage',
  'quote_details_display_form',
  'address_form',
  'subscription_preferences',
  'membership_data_panel',
  'my_personal_details_panel',
  'my_membership_details_panel',
  'my_contact_details_panel',
  'my_contact_subscriptions_details_panel',
  'transfer_file_download',
  'guaranteed_transfer_value',
  'Track_LVFAS_form',
  'beneficiaries_summary',
  'selected_option_summary',
  'beneficiaries_summary',
  'beneficiaries_wizard',
  'person_data',
  'upload_data',
  'email_verification_form',
  'bereavement_contact_selection',
  'Resource list',
  'Resource',
  'transfer_estimate',
  'case_tracker',
  'Tracker',
  'Info tile',
  'Chart',
  'transfer_loading',
  'Timeline',
  'Data summary',
  'lump_sum_installment_2',
  'beneficiaries_list',
  'designation_of_funds',
  'designation_of_funds_strategies',
  'show_available_funds',
  'Data table',
];

const FULL_HEIGHT_CONTENT_TYPES = ['Page menu', 'Info tile'];

const IGNORED_FULL_WIDTH_ALIGNMENTS = [
  'top-center',
  'top-right',
  'middle-center',
  'middle-right',
  'bottom-center',
  'bottom-right',
];

export const PanelBlock: React.FC<Props> = ({
  id,
  panelKey,
  page,
  tenant,
  header,
  layout,
  columns,
  role,
  reverseStacking,
}) => {
  const router = useRouter();
  const { isMobile } = useResolution();
  const panelColumns = columns?.values || [];
  const stackedPanelColumns = reverseStacking?.value && isMobile ? [...panelColumns].reverse() : panelColumns;

  return (
    <Stack id={panelKey || id} direction="column" flexWrap="wrap" gap={{ xs: 3, md: 8 }} role={role}>
      {header?.value && <Typography variant="h2">{header.value}</Typography>}
      <Stack width="100%" direction="row" flexWrap={{ xs: 'wrap', md: 'nowrap' }}>
        {stackedPanelColumns.map((column, idx) => {
          const columnColor = parseBackgroundColor(tenant, column.themeColorForBackround);
          return (
            <Stack
              key={`panel-column-${idx}`}
              direction="column"
              flexWrap="nowrap"
              className="panel-column"
              position="relative"
              borderRadius={column.roundCorners?.value ? '8px' : 0}
              borderTop={borderSideStyle(column, 'top')}
              borderBottom={borderSideStyle(column, 'bottom')}
              borderLeft={borderSideStyle(column, 'left')}
              borderRight={borderSideStyle(column, 'right')}
              borderColor={{ xs: 'transparent', md: 'primary.main' }}
              {...columnSpacingProps(column, idx)}
            >
              {columnColor && columnColor !== 'transparent' && (
                <>
                  <Box
                    aria-hidden
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bgcolor="appColors.incidental.000"
                    borderRadius={column.roundCorners?.value ? '8px' : 0}
                    zIndex={-1}
                  />
                  <Box
                    aria-hidden
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bgcolor={columnColor}
                    borderRadius={column.roundCorners?.value ? '8px' : 0}
                    zIndex={-1}
                  />
                </>
              )}
              {parseContent(columnValues(column), page, tenant, router.parsedQuery)
                .map((content, idx) =>
                  content ? (
                    <Box
                      key={`content-${idx}`}
                      mb={shouldReduceSpaceBetweenCmsBlocks(idx, column.contentBlocks?.values) ? -6 : 0}
                      width={{ xs: '100%', md: isBlockFullWidth(idx, column, layout) ? '100%' : 'auto' }}
                      height={isBlockFullHeight(idx, column) ? '100%' : 'auto'}
                    >
                      {content}
                    </Box>
                  ) : null,
                )
                .filter(Boolean)}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );

  function columnValues(column: PanelColumn) {
    return typeof column.contentBlocks?.values !== 'function' ? column.contentBlocks?.values || [] : [];
  }

  function columnSpacingProps(column: PanelColumn, idx: number): React.ComponentProps<typeof Stack> {
    const isFirstColumn = idx === 0;
    const isLastColumn = idx === stackedPanelColumns.length - 1;
    const alignmentSelection = column.alignment?.value?.selection;
    const paddingEnabled = !!column.enablePadding?.value;
    const paddingSides = column.paddingSide?.values?.map(side => side.selection.toLowerCase());
    const paddingDesktop = 6 * (column.desktopPaddingMultiplier?.value || 1);
    const paddingMobile = 3;
    const otherSpacingProps = {
      width: { xs: '100%', md: 'unset' },
      flex: { md: flexFromLayout(idx) },
      gap: column?.reducedGap?.value ? 6 : 12,
      alignItems: columnAlignment(alignmentSelection),
      justifyContent: columnJustification(alignmentSelection),
    };

    if (paddingEnabled && paddingSides?.length) {
      return {
        pl: { xs: paddingMobile, md: paddingSides.includes('left') ? paddingDesktop : 0 },
        pr: { xs: paddingMobile, md: paddingSides.includes('right') ? paddingDesktop : 0 },
        pt: { xs: paddingMobile, md: paddingSides.includes('top') ? paddingDesktop : 0 },
        pb: { xs: paddingMobile, md: paddingSides.includes('bottom') ? paddingDesktop : 0 },
        ...otherSpacingProps,
      };
    }

    if (paddingEnabled) {
      return { p: { xs: paddingMobile, md: paddingDesktop }, ...otherSpacingProps };
    }

    return {
      pt: { xs: alignmentSelection?.endsWith('left') || isFirstColumn ? 0 : 6, md: 0 },
      pb: { xs: alignmentSelection?.endsWith('right') || isLastColumn ? 0 : 6, md: 0 },
      pl: { xs: 0, md: alignmentSelection?.endsWith('left') || isFirstColumn ? 0 : paddingDesktop },
      pr: { xs: 0, md: alignmentSelection?.endsWith('right') || isLastColumn ? 0 : paddingDesktop },
      ...otherSpacingProps,
    };
  }

  function flexFromLayout(index: number) {
    switch (layout?.value?.selection) {
      case '50/50':
        return '50%';
      case '66/33':
        return index % 2 === 0 ? '66.67%' : '33.33%';
      case '80/20':
        return index % 2 === 0 ? '80%' : '20%';
      case '20/80':
        return index % 2 === 0 ? '20%' : '80%';
      case '45/10/45':
        return index % 3 === 1 ? '10%' : '45%';
      case '33/33/33':
        return '33.33%';
      default:
        return 1;
    }
  }
};

function isBlockFullHeight(idx: number, column: PanelColumn) {
  return (
    FULL_HEIGHT_CONTENT_TYPES.includes(column.contentBlocks?.values?.[idx].elements?.formKey?.value || '') ||
    FULL_HEIGHT_CONTENT_TYPES.includes(column.contentBlocks?.values?.[idx].type || '')
  );
}

function isBlockFullWidth(idx: number, column: PanelColumn, layout?: PanelLayoutSelection) {
  return (
    !isAlignedButton(idx, column) &&
    (layout?.value?.selection === '100' ||
      column.contentBlocks?.values?.[idx].type === 'Message' ||
      column.contentBlocks?.values?.[idx].elements?.showInAccordion?.value ||
      FULL_WIDTH_CONTENT_TYPES.includes(column.contentBlocks?.values?.[idx].elements?.formKey?.value || '') ||
      FULL_WIDTH_CONTENT_TYPES.includes(column.contentBlocks?.values?.[idx].type || ''))
  );
}

function isAlignedButton(idx: number, column: PanelColumn) {
  return (
    column?.contentBlocks?.values?.[idx]?.type === 'Button' &&
    IGNORED_FULL_WIDTH_ALIGNMENTS.includes(column?.alignment?.value?.selection)
  );
}

function columnJustification(alignment: ColumnAlignment['selection']) {
  switch (alignment) {
    case 'top-left':
    case 'top-center':
    case 'top-right':
      return 'flex-start';
    case 'middle-left':
    case 'middle-center':
    case 'middle-right':
      return 'center';
    case 'bottom-left':
    case 'bottom-center':
    case 'bottom-right':
      return 'flex-end';
    default:
      return undefined;
  }
}

function columnAlignment(alignment: ColumnAlignment['selection']) {
  switch (alignment) {
    case 'top-left':
    case 'middle-left':
    case 'bottom-left':
      return 'flex-start';
    case 'top-center':
    case 'middle-center':
    case 'bottom-center':
      return 'center';
    case 'top-right':
    case 'middle-right':
    case 'bottom-right':
      return 'flex-end';
    default:
      return undefined;
  }
}

function borderSideStyle(column: PanelColumn, side: PanelSideSelection) {
  const isBorderEnabled = column.border?.values?.find(border => border.selection === side);
  return isBorderEnabled ? { xs: 'unset', md: '1px solid' } : undefined;
}
