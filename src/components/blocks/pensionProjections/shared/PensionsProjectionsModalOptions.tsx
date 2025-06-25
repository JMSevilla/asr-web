import { Box, Grid } from '@mui/material';
import { CloseIcon, TabButton } from '../../..';
import { PensionsProjectionsOptionsContent, TabOption } from './PensionsProjectionsOptionsContent';
const tabs: TabOption[] = [
  {
    id: 1,
    nameLabelKey: 'full_pension_tab',
    headerLabelKey: 'full_pension_tab_header',
    textBelowLabelKey: 'full_pension_tab_html',
  },
  {
    id: 2,
    nameLabelKey: 'max_lump_sum_tab',
    headerLabelKey: 'max_lump_sum_tab_header',
    textBelowLabelKey: 'max_lump_sum_tab_text',
  },
];

interface Props {
  onClose: () => void;
  ages: number[];
  normalRetirementAge?: number | null;
}

export const PensionsProjectionsModalOptions: React.FC<Props> = ({ onClose, ages, normalRetirementAge }) => {
  return (
    <PensionsProjectionsOptionsContent
      ages={ages}
      tabs={tabs}
      normalRetirementAge={normalRetirementAge}
      containerSx={{ width: { xs: 300, sm: 400, md: 660 } }}
      headerComponent={({ tabsComponent }) => (
        <Grid container wrap="nowrap" mb={6} width="100%">
          <Grid container item justifyContent="center">
            {tabsComponent}
          </Grid>
          <Grid item>
            <Box
              ml={4}
              sx={{ cursor: 'pointer' }}
              display={{ xs: 'flex', md: 'none' }}
              height="100%"
              alignItems="center"
              onClick={onClose}
            >
              <CloseIcon />
            </Box>
          </Grid>
        </Grid>
      )}
      tabComponent={({ id, key, onClick, label, selected }) => (
        <TabButton
          key={key}
          sx={{
            typography: { xs: 'body2', md: 'body1' },
            minWidth: { xs: '120px', md: '167px' },
            marginLeft: id !== 1 ? '-1px' : 'unset',
          }}
          active={selected}
          onClick={onClick}
          data-testid={`pension-modal-tab-${id}-button`}
        >
          {label}
        </TabButton>
      )}
    />
  );
};
