import { CircularProgress, SxProps, TableCell, TableRow, Theme } from '@mui/material';
import { currencyValue } from '../../../../business/currency';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useApi } from '../../../../core/hooks/useApi';

interface Props {
  age: number;
  isNormalRetirementAge: (age: number) => boolean;
  index: number;
  sx?: SxProps<Theme>;
}

const tableCellSx: SxProps<Theme> = {
  typography: { xs: 'body2', md: 'body1' },
  overflow: 'hidden',
};

export const PensionOptionsTableRow: React.FC<Props> = ({ age, isNormalRetirementAge, index, sx = {} }) => {
  const { result, loading } = useApi(api => api.mdp.retirementOptions(age));
  const { labelByKey } = useGlobalsContext();
  const calculationSuccessful = result?.data?.isCalculationSuccessful ?? false;

  const cellSx: SxProps<Theme> = { ...tableCellSx, ...sx };

  return loading ? (
    <TableRow>
      <TableCell sx={cellSx} align="left" data-testid={`pension-option-row-${index}-age`}>
        {`${age}${isNormalRetirementAge(age) ? '*' : ''}`}
      </TableCell>
      <TableCell sx={cellSx} align={'right'} data-testid={`pension-option-row-${index}-income`}>
        <CircularProgress size={24} />
      </TableCell>
    </TableRow>
  ) : calculationSuccessful ? (
    <TableRow>
      <TableCell sx={cellSx} align="left" data-testid={`pension-option-row-${index}-age`}>
        {`${age}${isNormalRetirementAge(age) ? '*' : ''}`}
      </TableCell>
      <TableCell sx={cellSx} align={'right'} data-testid={`pension-option-row-${index}-income`}>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          `${labelByKey('currency:GBP')}${currencyValue(result?.data?.fullPensionYearlyIncome)}`
        )}
      </TableCell>
    </TableRow>
  ) : null;
};
