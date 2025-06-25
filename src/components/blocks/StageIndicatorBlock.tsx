import { Box, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../core/contexts/JourneyIndicatorContext';
import { useResolution } from '../../core/hooks/useResolution';

interface Props {
  id?: string;
  stages: { text: string; value: number }[];
  journeyStage: number;
  maxJourneySteps: string;
  journeyStep: number;
  singleStepSize: number;
}

export const StageIndicatorBlock: React.FC<Props> = ({
  id,
  stages,
  journeyStage,
  maxJourneySteps,
  journeyStep,
  singleStepSize,
}) => {
  const { labelByKey } = useGlobalsContext();
  const { isMobile } = useResolution();
  const { journeyInnerStep, journeyInnerStepsCount, setJourneyInnerStep, setJourneyInnerStepsCount, setCustomHeader } =
    useJourneyIndicatorContext();
  const indicatorInnerStepsWidth =
    journeyInnerStepsCount > 1 ? journeyInnerStep * (singleStepSize / journeyInnerStepsCount) : 0;
  const indicatorWidth = ((journeyStep + indicatorInnerStepsWidth) / Number(maxJourneySteps)) * 100;
  const sectionLabel = `${labelByKey('section')} ${journeyStage} ${labelByKey('of')} ${stages.length} - ${
    stages[Math.min(journeyStage, stages.length) - 1]?.text
  }`;

  useEffect(() => {
    setJourneyInnerStep(0);
    setJourneyInnerStepsCount(0);
    setCustomHeader({ title: null, action: null, icon: null });
  }, [setJourneyInnerStep, setJourneyInnerStepsCount, setCustomHeader]);

  return (
    <Grid
      tabIndex={0}
      aria-label={sectionLabel}
      id={id}
      container
      pb={2}
      direction="row"
      flexWrap="nowrap"
      spacing={4}
      justifyContent="space-between"
      borderBottom="2px solid"
      borderColor="#CCCCCC"
      position="relative"
      sx={{
        '&::before': {
          content: '""',
          position: 'absolute',
          width: `${indicatorWidth}%`,
          height: '2px',
          backgroundColor: 'primary.main',
          bottom: -2,
          transition: theme => theme.transitions.create(['width']),
        },
      }}
      data-testid="stage-indicator-block"
    >
      {isMobile ? (
        <Grid item xs={12}>
          <Typography color="primary" variant="body2" fontWeight="bold">
            {sectionLabel}
          </Typography>
        </Grid>
      ) : (
        stages.map((stage, index) => (
          <StageItem
            key={index}
            number={index + 1}
            text={stage.text}
            active={stage.value === journeyStage}
            completed={index < stages.findIndex(({ value }) => value === journeyStage)}
          />
        ))
      )}
    </Grid>
  );
};

const StageItem: React.FC<{ text: string; number: number; active: boolean; completed: boolean }> = ({
  text,
  active,
  completed,
  number,
}) => (
  <Grid item tabIndex={-1} display="flex" flexWrap="nowrap" gap={4} alignItems="center">
    <Box
      width={32}
      minWidth={32}
      height={32}
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="100px"
      border={`2px solid`}
      borderColor={active || completed ? 'primary.main' : 'appColors.essential.500'}
      sx={{ backgroundColor: completed ? 'primary.main' : 'none' }}
    >
      <Typography
        color={active ? 'primary.main' : completed ? 'common.white' : 'appColors.essential.500'}
        variant="body2"
        fontWeight={600}
      >
        {number}
      </Typography>
    </Box>
    <Typography
      color={active || completed ? 'primary.main' : 'appColors.essential.500'}
      variant="body2"
      fontWeight={600}
    >
      {text}
    </Typography>
  </Grid>
);
