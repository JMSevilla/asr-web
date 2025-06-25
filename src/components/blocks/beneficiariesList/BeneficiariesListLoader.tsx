import { Stack } from '@mui/material';
import { AnimatedBoxSkeleton } from '../../animations/AnimatedBoxSkeleton';

interface Props {
  id: string;
  light?: boolean;
  noBorderRadius?: boolean;
}

export const BeneficiariesListLoader: React.FC<Props> = ({ id, light = true, noBorderRadius = false }) => {
  return (
    <Stack id={id} gap={2} data-testid="beneficiaries-list-loader" width="100%">
      {Array.from({ length: 3 }).map((_, idx) => (
        <AnimatedBoxSkeleton
          key={idx}
          width="100%"
          height={48}
          borderRadius={noBorderRadius ? 'unset' : '8px'}
          light={light}
        />
      ))}
    </Stack>
  );
};
