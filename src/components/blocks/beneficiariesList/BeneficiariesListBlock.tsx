import { Box, Stack, Typography } from '@mui/material';
import { PanelListItem } from '../../../api/content/types/page';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApi } from '../../../core/hooks/useApi';
import { usePanelBlock } from '../../../core/hooks/usePanelBlock';
import { useResolution } from '../../../core/hooks/useResolution';
import { usePanelCardContext } from '../../Card';
import { BeneficiariesListItem } from './BeneficiariesListItem';
import { BeneficiariesListLoader } from './BeneficiariesListLoader';
import { useVisibleItemsLimiter } from './hooks';
import { BeneficiaryRow } from './types';

interface Props {
  id: string;
  panelList?: PanelListItem[];
  parameters?: { key: string; value: string }[];
}

const CARD = {
  MAIN_CONTENT_XS_HEIGHT: 173,
  MAIN_CONTENT_MD_HEIGHT: 220,
};

const MORE_ROWS_HEIGHT = 22;

export const BeneficiariesListBlock: React.FC<Props> = ({ id, panelList, parameters = [] }) => {
  const { classifierByKey, labelByKey } = useGlobalsContext();
  const { panelByKey } = usePanelBlock(panelList);
  const relationshipColor = classifierByKey('beneficiaries_relationship_colors');

  const headerNameLabel = findValueByKey('header_name_label', parameters);
  const headerRelationshipLabel = findValueByKey('header_relationship_label', parameters);
  const headerLsAllocationLabel = findValueByKey('header_ls_allocation_label', parameters);
  const ariaPensionBeneficiaryLabel = findValueByKey('aria_referred_pension_label', parameters);
  const ariaSummaryLabel = findValueByKey('aria_allocation_summary_label', parameters);

  const { isCard } = usePanelCardContext();
  const { isMobile } = useResolution();
  const beneficiaries = useApi(async api => {
    const result = await api.mdp.userBeneficiaries();
    const rows: BeneficiaryRow[] = [
      ...(result.data?.people?.map<BeneficiaryRow>(person => ({
        icon: 'person-outline', // person.pensionPercentage > 0 ? 'person-done-outline' : 'person-outline',
        name: [person.title, person.forenames, person.surname].filter(Boolean).join(' '),
        color: relationshipColor?.find(option => option.value.includes(person.relationship))?.label,
        relationship: person.relationship,
        percentage: person.lumpSumPercentage,
        isPensionBeneficiary: person.pensionPercentage > 0,
      })) || []),
      ...(result.data?.organizations?.map<BeneficiaryRow>(organization => ({
        icon: 'briefcase-outline',
        name: organization.organizationName,
        color: relationshipColor?.find(option => option.value.includes(organization.organizationType))?.label,
        relationship: organization.organizationType,
        percentage: organization.lumpSumPercentage,
      })) || []),
    ].sort((a, b) => b.percentage - a.percentage);

    return rows.map((beneficiary, index) => (
      <BeneficiariesListItem
        index={index}
        key={`${beneficiary.name}-${index}`}
        beneficiary={beneficiary}
        ariaPensionBeneficiaryLabel={ariaPensionBeneficiaryLabel}
      />
    ));
  });

  const beneficiariesRows = beneficiaries.result ?? [];
  const containerHeight = isMobile ? CARD.MAIN_CONTENT_XS_HEIGHT : CARD.MAIN_CONTENT_MD_HEIGHT;
  const { tBodyRef, visibleItems, visibleItemsCount } = useVisibleItemsLimiter(
    beneficiariesRows,
    containerHeight,
    MORE_ROWS_HEIGHT,
  );

  if (beneficiaries.loading) {
    return <BeneficiariesListLoader id={id} light={!isCard} noBorderRadius={isCard} />;
  }

  if (!isCard && !beneficiariesRows.length) {
    return (
      <Box id={id} data-testid="beneficiaries-list-empty" width="100%">
        {panelByKey('beneficiaries_list_fallback_panel')}
      </Box>
    );
  }

  return (
    <Stack
      id={id}
      data-testid="beneficiaries-list"
      maxHeight={containerHeight}
      alignItems="flex-start"
      overflow="hidden"
      width="100%"
      alignSelf="stretch"
      flexGrow={1}
      sx={{ tr: { backgroundColor: 'appColors.incidental.000' } }}
    >
      <Box
        component="table"
        tabIndex={0}
        width="100%"
        sx={{ borderCollapse: 'separate', borderSpacing: '0' }}
        aria-label={ariaSummaryLabel}
      >
        <Box component="caption" className="visually-hidden">
          {ariaSummaryLabel}
        </Box>
        <Box component="thead" role="rowgroup">
          <Box component="tr" role="row">
            {[headerNameLabel, headerRelationshipLabel, headerLsAllocationLabel].map((header, index) => (
              <Box key={index} component="th" role="columnheader" aria-sort="none" className="visually-hidden">
                {header}
              </Box>
            ))}
          </Box>
        </Box>
        <Box ref={tBodyRef} component="tbody" role="rowgroup">
          {visibleItems}
        </Box>
      </Box>
      {visibleItemsCount !== null && visibleItemsCount < beneficiariesRows.length && (
        <Stack
          flexDirection="row"
          alignItems="flex-start"
          px={{ xs: 8, md: 10 }}
          width="100%"
          alignSelf="stretch"
          flexGrow={0}
          maxHeight={MORE_ROWS_HEIGHT}
        >
          <Typography
            variant="body2"
            component="span"
            data-testid="beneficiaries-list-more"
            sx={{
              fontWeight: theme => theme.typography.fontWeightRegular,
              fontSize: theme => theme.typography.body2.fontSize,
              lineHeight: '22px',
              color: theme => theme.palette.common.black,
            }}
          >
            {`+${beneficiariesRows.length - visibleItemsCount} ${labelByKey('more')}`}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
