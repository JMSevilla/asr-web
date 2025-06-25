import { Box, Stack } from '@mui/material';
import { useCallback } from 'react';
import { TextButton } from '../../../buttons';
import { PensionsProjectionsOptionsContent, TabOption } from './PensionsProjectionsOptionsContent';

const tabs: TabOption[] = [
  {
    id: 1,
    nameLabelKey: 'full_pension_tab',
  },
  {
    id: 2,
    nameLabelKey: 'max_lump_sum_tab',
  },
];

interface Props {
  ages: number[];
  normalRetirementAge?: number | null;
}

export const PensionsProjectionsOptions: React.FC<Props> = ({ ages, normalRetirementAge }) => {
  return (
    <PensionsProjectionsOptionsContent
      ages={ages}
      normalRetirementAge={normalRetirementAge}
      tabs={tabs}
      containerSx={{ width: { xs: 400, sm: 660, md: 860 } }}
      headerComponent={useCallback(
        ({ tabsComponent }) => (
          <Stack direction="row" gap={4} justifyContent="left" sx={{ borderBottom: 1, borderColor: 'divider' }}>
            {tabsComponent}
          </Stack>
        ),
        [],
      )}
      tabComponent={useCallback(
        ({ id, key, onClick, label, selected }) => (
          <Box key={key}>
            <TextButton
              type="Secondary"
              sx={{
                justifyContent: 'start',
                minWidth: 'auto',
                boxSizing: 'border-box',
                border: defaultBorderStyle,
                borderBottom: theme => (selected ? `2px solid ${theme.palette.appColors.primary}` : defaultBorderStyle),
                '&:hover, &:focus': {
                  border: defaultBorderStyle,
                  borderBottom: theme =>
                    selected ? `2px solid ${theme.palette.appColors.primary}` : defaultBorderStyle,
                },
                typography: { xs: 'body2', md: 'body1' },
                fontWeight: {
                  xs: 'bold',
                  md: 'bold',
                },
                '&.Mui-focusVisible': {
                  border: defaultBorderStyle,
                },
              }}
              onClick={onClick}
              data-testid={`pension-tab-${id}-button`}
            >
              {label}
            </TextButton>
          </Box>
        ),
        [],
      )}
    />
  );
};

const defaultBorderStyle = '2px solid transparent';
