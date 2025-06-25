import { TableCell, TableRow } from '@mui/material';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { DataTableV2 } from '../../table/data-table/DataTableV2';

interface Props {
  id?: string;
  details: { title: string; name: string; gender: string; dateOfBirth: string };
}

export const PersonalDetailsList: React.FC<Props> = ({ id, details }) => {
  const { labelByKey } = useGlobalsContext();

  return (
    <DataTableV2
      data-testid="personal-details-list"
      data={[
        { title: labelByKey('member_title'), value: details.title },
        { title: labelByKey('member_name'), value: details.name },
        { title: labelByKey('member_gender'), value: details.gender },
        { title: labelByKey('member_dob'), value: details.dateOfBirth },
      ]}
      tableHeaders={[]}
      bodyRowComponent={(data, id) => {
        return (
          <TableRow
            sx={{
              ':nth-of-type(odd)': {
                backgroundColor: theme => theme.palette.appColors.support80.transparentLight,
              },
            }}
          >
            <TableCell
              align="left"
              sx={{ fontWeight: 'bold!important' }}
              data-testid={`pension-option-row-${id}-title`}
            >
              {data.title}
            </TableCell>
            <TableCell align={'left'} data-testid={`pension-option-row-${id}-value`}>
              {data.value}
            </TableCell>
          </TableRow>
        );
      }}
    />
  );
};
