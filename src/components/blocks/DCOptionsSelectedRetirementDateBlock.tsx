import { Stack, Typography } from '@mui/material';
import { AnimatedBoxSkeleton } from '..';
import { formatDate } from '../../business/dates';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useCachedCmsTokens } from '../../core/contexts/contentData/useCachedCmsTokens';
import { useRetirementContext } from '../../core/contexts/retirement/RetirementContext';

interface Props {
  id: string;
}

export const DCOptionsSelectedRetirementDateBlock: React.FC<Props> = ({ id }) => {
  const { labelByKey } = useGlobalsContext();
  const { quotesOptionsLoading } = useRetirementContext();
  const cmsTokens = useCachedCmsTokens();

  if (quotesOptionsLoading || cmsTokens.loading) {
    return (
      <Stack id={id} gap={4} width={220} data-testid="dc-retirement-date-loader">
        <AnimatedBoxSkeleton width={220} height={46} />
        <AnimatedBoxSkeleton height={32} width={160} light />
      </Stack>
    );
  }

  return (
    <Stack id={id} gap={4} data-testid="dc-retirement-date">
      {cmsTokens.data?.selectedRetirementDate && (
        <Typography variant="h1" component="span" fontWeight="bold" color="primary">
          {formatDate(cmsTokens.data?.selectedRetirementDate)}
        </Typography>
      )}
      {cmsTokens.data?.selectedRetirementAge && (
        <Typography variant="h3" component="span" color="primary">
          {`(${labelByKey('age')} ${cmsTokens.data?.selectedRetirementAge})`}
        </Typography>
      )}
    </Stack>
  );
};
