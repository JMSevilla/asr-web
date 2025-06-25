import { Box, keyframes, Stack, Typography } from '@mui/material';
import { forwardRef } from 'react';
import { EvaIcon } from '../../EvaIcon';
import { BeneficiaryRow } from './types';

interface Props {
  beneficiary: BeneficiaryRow;
  index: number;
  ariaPensionBeneficiaryLabel?: string;
  temporary?: boolean;
}

const fadeIn = keyframes` 
  from { opacity: 0; } 
  to { opacity: 1; } 
`;

export const BeneficiariesListItem = forwardRef<HTMLTableRowElement, Props>(
  ({ beneficiary, index, ariaPensionBeneficiaryLabel, temporary }, ref) => {
    return (
      <Stack
        component="tr"
        role="row"
        ref={ref}
        key={`${beneficiary.name}-${index}`}
        flexDirection="row"
        boxSizing="border-box"
        alignItems="center"
        px={2}
        py={{ md: 2.5 }}
        gap={4}
        width="100%"
        minHeight={48}
        border={theme => `1px solid ${theme.palette.divider}`}
        borderRadius="8px"
        flexGrow={0}
        mb={2}
        sx={{ animation: `${fadeIn} 0.5s ease-in-out` }}
        {...(temporary && { tabIndex: -1, 'aria-hidden': true, sx: { opacity: 0 } })}
      >
        <Stack component="th" role="rowheader" flexDirection="row" alignItems="center" gap={2} flex={1}>
          <EvaIcon name={beneficiary.icon} height={16} width={16} ariaHidden primaryFill />
          {beneficiary.isPensionBeneficiary && <span className="visually-hidden">{ariaPensionBeneficiaryLabel}</span>}
          <Typography
            flex={1}
            component="span"
            variant="body2"
            align="left"
            lineHeight="22px"
            color="text.primary"
            sx={{
              wordBreak: 'break-all',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 6,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
            }}
          >
            {beneficiary.name}
          </Typography>
        </Stack>
        <Stack component="td" role="cell" flexDirection="row" alignItems="flex-start">
          <Stack
            p={1}
            flexDirection="row"
            alignItems="flex-start"
            bgcolor={beneficiary.color || 'primary.main'}
            borderRadius="4px"
          >
            <Typography
              variant="caption"
              component="span"
              fontWeight="bold"
              lineHeight="20px"
              color={theme =>
                beneficiary.color
                  ? theme.palette.getContrastText(beneficiary.color)
                  : theme.palette.primary.contrastText
              }
            >
              {beneficiary.relationship}
            </Typography>
          </Stack>
        </Stack>
        <Box component="td" role="cell" p={0} minWidth={36} textAlign="right" whiteSpace="nowrap">
          <Typography variant="body2" component="span" fontWeight="bold" lineHeight="22px" color="text.primary">
            {beneficiary.percentage}%
          </Typography>
        </Box>
      </Stack>
    );
  },
);
