import { DataTableV2 } from '../../../table/data-table/DataTableV2';
import { DataTableHeader, DataTableSx } from '../../../table/types';
import { DEFAULT_PAGE_SIZE } from '../../dataTable/dataTableV2/hooks';
import { MaxLumpOptionsTableRow } from './MaxLumpOptionsTableRow';

const tableHeaders: DataTableHeader[] = [
  { name: 'Age' },
  { name: 'Max lump sum', align: 'right' },
  { name: 'Yearly income', align: 'right' },
];

interface Props {
  ages: number[];
  isNormalRetirementAge: (age: number) => boolean;
  sx?: DataTableSx;
}

export const MaxLumpTabTable: React.FC<Props> = ({ ages, isNormalRetirementAge, sx }) => {
  return (
    <DataTableV2
      data={ages}
      tableHeaders={tableHeaders}
      sx={sx}
      pagination={{
        totalCount: ages.length,
        defaultPageSize: DEFAULT_PAGE_SIZE,
      }}
      bodyRowComponent={(age, id, sx) => (
        <MaxLumpOptionsTableRow
          age={age}
          isNormalRetirementAge={isNormalRetirementAge}
          key={id}
          index={id}
          sx={{ ...sx }}
        />
      )}
    />
  );
};
