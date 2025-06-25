import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { TooltipValues } from '../../api/content/types/page';
import { doesAccessKeyHaveWordingFlag } from '../../business/access-key';
import { classifierLabelByValue } from '../../business/classifier';
import { NA_SYMBOL } from '../../business/constants';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useCachedAccessKey } from '../../core/hooks/useCachedAccessKey';
import { useDataReplacerApi } from '../../core/hooks/useDataReplacerApi';
import { EvaIcon } from '../EvaIcon';
import { Tooltip } from '../Tooltip';
import { AnimatedBoxSkeleton } from '../animations';

interface Props {
  id?: string;
  data?: string;
  iconName?: string;
  tileKey?: string;
  title?: string;
  tooltip?: TooltipValues;
  sourceUrl?: string;
  backgroundColor?: string | null;
  textColor?: string | null;
  iconColor?: string | null;
}

export const InfoTileBlock: React.FC<Props> = ({
  id,
  data: preData,
  iconName,
  title,
  tileKey,
  tooltip,
  sourceUrl,
  backgroundColor,
  textColor,
  iconColor,
}) => {
  const { labelByKey, classifierByKey } = useGlobalsContext();
  const accessKey = useCachedAccessKey();
  const hasError = isInErrorState();
  const replacer = useDataReplacerApi(hasError ? undefined : sourceUrl);
  const data = hasError ? NA_SYMBOL : preData;
  const [enriched, setEnriched] = useState<Partial<{ title: string; data: string }> | null>(null);

  useEffect(() => {
    if (!replacer.loading && !enriched) {
      setEnriched({ title: replacer.replaceDataInText(title), data: replacer.replaceDataInText(data) });
    }
  }, [replacer.loading, enriched]);

  return (
    <Box
      id={tileKey || id}
      data-testid="info-tile-block"
      p={6}
      pt={backgroundColor === 'transparent' ? 0 : 6}
      height="100%"
      borderRadius="8px"
      position="relative"
      role="note"
      {...replacer.elementProps(id)}
    >
      {backgroundColor !== 'transparent' && (
        <>
          <Box
            aria-hidden
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            borderRadius="8px"
            bgcolor="appColors.incidental.000"
            zIndex={-4}
          />
          <Box
            aria-hidden
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            borderRadius="8px"
            bgcolor={backgroundColor || 'appColors.support80.transparentLight'}
            zIndex={-3}
          />
        </>
      )}

      <Stack direction="row" alignItems="flex-start" gap={4}>
        {iconName && (
          <Box
            mt={1.5}
            width={48}
            minWidth={48}
            height={48}
            minHeight={48}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="100px"
            position="relative"
            overflow="hidden"
            data-testid={iconName}
          >
            <Box
              aria-hidden
              position="absolute"
              width="100%"
              height="100%"
              bgcolor="appColors.incidental.000"
              zIndex={-2}
            />
            <Box
              aria-hidden
              position="absolute"
              width="100%"
              height="100%"
              bgcolor="appColors.support60.transparentLight"
              zIndex={-1}
            />

            <EvaIcon name={iconName} width={24} height={24} ariaHidden primaryFill fill={iconColor || undefined} />
          </Box>
        )}
        <Typography data-testid="info-tile-title" variant="body2" component="p" color={textColor || 'text.secondary'}>
          {enriched?.title || replacer.replaceDataInText(title)}
          {replacer.loading ? (
            <AnimatedBoxSkeleton width="100%" height={32} mt={1} data-testid="info-tile-loader" component="span" />
          ) : (
            <Stack direction="row" alignItems="center" gap={1} component="strong" mt={1}>
              <Typography
                data-testid="info-tile-value"
                variant="secondLevelValue"
                color={textColor || 'text.primary'}
                sx={{ wordBreak: 'break-word' }}
                component="span"
                aria-label={isDataEmpty(enriched?.data) ? labelByKey('no_value') : undefined}
              >
                {enriched?.data}
              </Typography>
              {tooltip?.elements && (
                <Tooltip
                  header={tooltip.elements.headerText.value}
                  html={tooltip.elements.contentText.value}
                  iconColor={iconColor || undefined}
                />
              )}
            </Stack>
          )}
        </Typography>
      </Stack>
    </Box>
  );

  function isInErrorState() {
    const wordingFlagKey = 'LandingPageNormalState';
    const lifesightWebRules = classifierByKey('web_rules_lifesight');
    const landingPageNormalStateRule = classifierLabelByValue(lifesightWebRules || [], wordingFlagKey);
    if (!landingPageNormalStateRule?.includes('SEEBAL=1')) {
      return false;
    }

    const hasRequiredWordingFlag = doesAccessKeyHaveWordingFlag(accessKey.data?.contentAccessKey, wordingFlagKey);
    return !hasRequiredWordingFlag;
  }

  function isDataEmpty(data?: string | null) {
    return data === undefined || data === NA_SYMBOL || data === null;
  }
};
