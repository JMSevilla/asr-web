import {
  Box,
  Table as MUITable,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { ParsedHtml, usePanelCardContext } from '../..';
import { LatestContributionsResponse } from '../../../api/mdp/types';
import { currencyValue } from '../../../business/currency';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApi } from '../../../core/hooks/useApi';
import { useDataReplacerApi } from '../../../core/hooks/useDataReplacerApi';
import { useResolution } from '../../../core/hooks/useResolution';
import { ChartLoader } from '../chart/ChartLoader';
import { LatestContributionsItem } from './LatestContributionItem';

interface Props {
  id: string;
  parameters: { key: string; value: string }[];
}
interface LatestContributionsList extends LatestContributionsResponse {
  totalAmountTextLabel?: string;
}
export const LatestContributionsBlock: React.FC<Props> = ({ id, parameters }) => {
  const theme = useTheme();
  const { labelByKey } = useGlobalsContext();
  const { isCard, url } = usePanelCardContext();
  const { isMobile } = useResolution();
  const replacer = useDataReplacerApi(url);

  const tableStyles = {
    card: {
      td: {
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
      },
      tr: {
        height: isMobile ? '48px' : '54px',
        width: isMobile ? '200px' : '324px',
        'td:nth-child(2)': {
          textAlign: 'right',
        },
      },
    },
    default: {},
  };
  const response = useApi(api => (url ? api.mdp.dataSummary<LatestContributionsResponse>(url, {}) : Promise.reject()));
  const item: LatestContributionsList = {
    totalValue: response.result?.data?.totalValue || 0,
    totalAmountTextLabel: parameters.find(param => param.key === 'total-amount-text')?.value || '',
    currency: response.result?.data?.currency || 'GBP',
    paymentDate: response.result?.data?.paymentDate || '',
    contributions: response.result?.data?.contributions || [],
  };

  if (response?.loading) {
    return (
      <Box height="150px" width="343px">
        <ChartLoader id="contributions-loader" fullHeight />
      </Box>
    );
  }

  const renderTableBody = () => {
    return item.contributions.map((contribution, idx) => (
      <TableRow key={contribution.label.split(' ')[0].toLowerCase()}>
        <TableCell component="td" padding="none" sx={{ maxWidth: '170px', paddingRight: '10px' }}>
          <Stack display="flex" flexDirection="row">
            <LatestContributionsItem
              key={idx}
              label={contribution.label}
              contributionsLength={item.contributions.length}
            />
          </Stack>
        </TableCell>
        <TableCell component="td" padding="none">
          <Typography variant="h4" sx={{ ...theme.typography.h4, fontWeight: theme.typography.fontWeightBold }}>
            {labelByKey(`currency:${item.currency}`)}
            {currencyValue(contribution.value)}
          </Typography>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box
      key={id}
      data-testid="latest-contributions-testid"
      display="flex"
      flexDirection="column"
      maxHeight={'fit-content'}
      gap={isMobile ? 1 : 2}
    >
      <Stack>
        <Typography variant="h1" sx={{ ...theme.typography.h1, fontWeight: theme.typography.fontWeightBold }}>
          {labelByKey(`currency:${item.currency}`)}
          {currencyValue(item.totalValue)}
        </Typography>
        {item?.totalAmountTextLabel && (
          <Typography
            variant="body2"
            sx={{
              ...theme.typography.body2,
              color: theme.palette.text.secondary,
              div: {
                fontSize: `${theme.typography.body2.fontSize}!important`,
              },
            }}
          >
            <ParsedHtml html={replacer.replaceDataInText(item.totalAmountTextLabel) ?? ''} />
          </Typography>
        )}
      </Stack>
      <Stack
        sx={
          isCard
            ? {
                '@media (min-width: 1146px) and (max-width: 1150px)': { display: 'none' },
                '@media (min-width: 1190px) and (max-width: 1310px)': { display: 'none' },
              }
            : {}
        }
      >
        <TableContainer id={id} sx={{ borderTopColor: 'divider' }}>
          <MUITable data-testid="contributions-table-testid">
            <TableBody sx={isCard ? tableStyles.card : tableStyles.default}>{renderTableBody()}</TableBody>
          </MUITable>
        </TableContainer>
      </Stack>
    </Box>
  );
};
