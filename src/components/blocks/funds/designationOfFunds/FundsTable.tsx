import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FundWithPercentage, NumberField } from '../../..';
import { ContentFund } from '../../../../api/content/types/funds';
import { isValidPercentage } from '../../../../business/numbers';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useFormSubmissionBindingHooks } from '../../../../core/hooks/useFormSubmissionBindingHooks';
import { EvaIcon } from '../../../EvaIcon';

interface Props {
  prefix: string;
  rows: ContentFund[];
  defaultValues?: FundWithPercentage[];
  onLoaded: (selectedFunds: string[]) => void;
  onDelete: (row: ContentFund) => void;
  onSubmit: (values: FundWithPercentage[]) => Promise<void>;
}

const normalizeNumber = (val: string | number) => (Number.isNaN(val) || val === undefined ? 0 : +val);

export const FundsTable: React.FC<Props> = ({ prefix, rows, defaultValues, onLoaded, onDelete, onSubmit }) => {
  const { labelByKey } = useGlobalsContext();
  const form = useForm<{ rows: Record<string, number> }>({ defaultValues: { rows: {} }, mode: 'onBlur' });
  const total = Object.values(form.watch('rows')).reduce(
    (acc, curr) => normalizeNumber(acc) + normalizeNumber(curr),
    0,
  );
  const totalIncorrect = !!rows.length && total !== 100;

  useFormSubmissionBindingHooks({
    cb: handleSubmit,
    key: 'funds-selected-list',
    isValid: !!rows.length && total === 100,
    initDependencies: [rows.length, total],
  });

  useEffect(() => {
    if (rows) {
      const values = form.getValues('rows');
      const filteredOldValues = Object.keys(values).reduce((acc, key) => {
        if (rows.find(row => `fund-${row.fundCode}` === key)) {
          return { ...acc, [key]: values[key] || 0 };
        }
        return acc;
      }, {});
      const newValues = rows.reduce((acc, row) => ({ ...acc, [`fund-${row.fundCode}`]: 0 }), {});
      form.reset(
        { rows: { ...newValues, ...filteredOldValues } },
        { keepValues: false, keepDirtyValues: false, keepDefaultValues: false },
      );
    }
  }, [rows]);

  useEffect(() => {
    if (defaultValues) {
      const values = defaultValues.reduce((acc, row) => ({ ...acc, [`fund-${row.fundCode}`]: row.percentage }), {});
      form.reset({ rows: values }, { keepValues: false, keepDirtyValues: false, keepDefaultValues: false });
      onLoaded(defaultValues.map(row => row.fundCode));
    }
  }, [defaultValues]);

  return (
    <TableContainer>
      <StyledTableWithBorderBottom
        data-testid="funds-table"
        sx={{ border: '2px solid', borderColor: totalIncorrect ? 'error.main' : 'transparent' }}
      >
        <caption className="visually-hidden">{labelByKey(`${prefix}_table_your_selected_funds`)}</caption>
        <StyledTableHead>
          <TableRow>
            <TableCell width="80%">
              <Typography component="h3" noWrap fontWeight="bold">
                {labelByKey(`${prefix}_table_option_header`)}
              </Typography>
            </TableCell>
            <TableCell align="center" color={totalIncorrect ? 'error' : 'text.primary'}>
              <Typography component="h3" noWrap fontWeight="bold" color={totalIncorrect ? 'error' : 'text.primary'}>
                {labelByKey(`${prefix}_table_percentage_header`)}
              </Typography>
            </TableCell>
            <TableCell />
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {rows.map(row => (
            <StyledTableRow key={row.fundName} data-testid={`fund-${row.fundCode}`}>
              <TableCell width="30%">
                <Typography component="label" htmlFor={`fund-${row.fundCode}`}>
                  {row.fundName}
                </Typography>
              </TableCell>
              <TableCell align="center" padding="none">
                <Box width={100} ml="auto" mr="auto" pb={2} sx={{ '& input': { textAlign: 'center' } }}>
                  <NumberField
                    hideLabel
                    name={`rows.fund-${row.fundCode}`}
                    control={form.control}
                    type="number"
                    format="###"
                    isAllowed={values => isValidPercentage(values.floatValue)}
                    decimalScale={0}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <IconButton
                  data-testid={`fund-${row.fundCode}-delete`}
                  aria-label={labelByKey(`${prefix}_table_remove_fund`, { name: row.fundName })}
                  sx={{ svg: { fill: theme => theme.palette.primary.main } }}
                  onClick={handleDelete(row)}
                >
                  <EvaIcon name="trash-outline" />
                </IconButton>
              </TableCell>
            </StyledTableRow>
          ))}
          {rows.length === 0 && (
            <TableRow data-testid="no-funds">
              <TableCell colSpan={3}>{labelByKey(`${prefix}_table_no_funds`)}</TableCell>
            </TableRow>
          )}
          <StyledTableRow>
            <TableCell width="30%" scope="row" component="th">
              <Typography component="h3" noWrap fontWeight="bold">
                {labelByKey(`${prefix}_table_total`)}
              </Typography>
            </TableCell>
            <TableCell align="center">
              <Typography
                component="span"
                noWrap
                fontWeight="bold"
                color={totalIncorrect ? 'error' : 'text.primary'}
                data-testid="total"
              >
                {total}%
              </Typography>
            </TableCell>
            <TableCell />
          </StyledTableRow>
        </TableBody>
      </StyledTableWithBorderBottom>
      {totalIncorrect && (
        <Typography
          color="error"
          variant="body1"
          mt={2}
          data-testid="total-incorrect"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, svg: { fill: theme => theme.palette.error.main } }}
        >
          <EvaIcon name="info-outline" height={24} width={24} ariaHidden />
          {labelByKey(`${prefix}_table_total_incorrect`)}
        </Typography>
      )}
    </TableContainer>
  );

  function handleDelete(row: ContentFund) {
    return () => onDelete(row);
  }

  async function handleSubmit() {
    const values = form.getValues('rows');
    const selectedRows = rows.map(row => ({ ...row, percentage: values[`fund-${row.fundCode}`] }));
    await onSubmit(selectedRows);
  }
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': { border: 0 },
  '&:nth-of-type(even)': { backgroundColor: theme.palette.appColors.support80.transparentLight },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& th': { fontWeight: 'bold', borderBottom: `1px solid ${theme.palette.divider}` },
}));

const StyledTableWithBorderBottom = styled(Table)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& td': { borderBottom: `1px solid ${theme.palette.divider}` },
  '& thead > tr': { backgroundColor: theme.palette.appColors.support80.transparentLight },
}));
