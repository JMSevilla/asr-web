import { PlayArrow, PlayArrowOutlined } from '@mui/icons-material';
import { Box, Stack, TableCell, TableHead, TableRow, Typography, styled } from '@mui/material';
import React, { useState } from 'react';
import { DataTableHeader, DataTableSx, ParsedHtml } from '../..';
import { hasMatchingParserRule } from '../../../cms/inject-tokens';
import { tableCellAlignToJustifyContent } from './utils';

interface DataTableHeadProps {
  tableHeaders: DataTableHeader[];
  sx?: DataTableSx;
  loading?: boolean;
  isEmpty?: boolean;
  sortColumn?: string;
  sortAscending?: boolean;
  onSort?: (column: string) => void;
  evenColumnWidth?: number;
}

export const DataTableHead: React.FC<DataTableHeadProps> = ({
  tableHeaders,
  sx,
  loading,
  isEmpty,
  sortColumn,
  sortAscending,
  onSort,
  evenColumnWidth,
}) => {
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  return (
    <StyledTableHead sx={sx?.tableHead}>
      <TableRow>
        {tableHeaders.map((header, idx) => {
          const { dataField, ...cellProps } = header;
          const isCurrentSortColumn = sortColumn === header.name;
          const isHovered = hoveredColumn === header.name;
          const isSortable = header.sort && onSort && !loading && !isEmpty;
          return (
            <TableCell
              key={idx}
              {...cellProps}
              sx={{
                ...sx?.headerCell?.cell,
                ...(isSortable ? { cursor: 'pointer' } : {}),
              }}
              align={header.align}
              width={header.width ?? `${evenColumnWidth}%`}
              data-testid={`data-table-header-${header.name}`}
              onClick={() => {
                if (isSortable) {
                  onSort?.(header.name);
                }
              }}
              onMouseEnter={() => setHoveredColumn(header.name)}
              onMouseLeave={() => setHoveredColumn(null)}
              {...(isSortable
                ? {
                    role: 'button',
                    'aria-label': `Sort by ${header.name} ${
                      isCurrentSortColumn && sortAscending ? 'descending' : 'ascending'
                    }`,
                    'aria-sort': isCurrentSortColumn ? (sortAscending ? 'ascending' : 'descending') : 'none',
                    tabIndex: 0,
                    onKeyDown: (e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onSort?.(header.name);
                        e.preventDefault();
                      }
                    },
                  }
                : {})}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={1}
                justifyContent={tableCellAlignToJustifyContent(header.align)}
              >
                {isSortable && (
                  <Box sx={{ width: 24, height: 24 }}>
                    {isCurrentSortColumn ? (
                      <PlayArrow
                        data-testid={`sort-icon-${header.name}`}
                        sx={{
                          transition: 'transform 0.3s ease-in-out',
                          transform: sortAscending ? 'rotate(270deg)' : 'rotate(90deg)',
                        }}
                      />
                    ) : isHovered ? (
                      <PlayArrow
                        data-testid={`sort-icon-${header.name}-hover`}
                        sx={{
                          transform: 'rotate(90deg)',
                        }}
                      />
                    ) : sortColumn ? (
                      <PlayArrowOutlined
                        data-testid={`sort-icon-${header.name}-outlined`}
                        sx={{
                          transform: 'rotate(90deg)',
                        }}
                      />
                    ) : null}
                  </Box>
                )}
                <Typography
                  sx={{
                    typography: { xs: 'body2', md: 'body1' },
                    fontWeight: 'bold !important',
                    fontSize: theme => theme.typography.h5.fontSize + ' !important',
                    ...sx?.headerCell?.typography,
                  }}
                >
                  {hasMatchingParserRule(header.name) ? <ParsedHtml html={header.name} /> : header.name}
                </Typography>
              </Stack>
            </TableCell>
          );
        })}
      </TableRow>
    </StyledTableHead>
  );
};

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& th': {
    backgroundColor: theme.palette.appColors.primary,
    color: theme.palette.primary.contrastText,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    fontSize: theme.typography.body1.fontSize,
    verticalAlign: 'middle',
    '& .html-container': {
      display: 'flex',
      alignItems: 'center',
      '& svg': {
        color: theme.palette.primary.contrastText,
      },
    },
  },
}));
