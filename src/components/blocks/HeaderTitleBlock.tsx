import { Box, Typography, useTheme } from '@mui/material';
import { FileValue } from '../../api/content/types/common';
import { JourneyTypeSelection } from '../../api/content/types/page';
import { useJourneyIndicatorContext } from '../../core/contexts/JourneyIndicatorContext';
import { useResolution } from '../../core/hooks/useResolution';
import { SvgIcon } from '../SvgIcon';
import { BackButtonBlock } from './BackButtonBlock';

interface Props {
  id?: string;
  icon?: FileValue;
  pageHeader?: string;
  pageKey: string;
  backPageKey?: string;
  indicatorExists?: boolean;
  isInStickOutPage?: boolean;
  journeyType?: JourneyTypeSelection;
}

export const HeaderTitleBlock: React.FC<Props> = ({
  id,
  pageHeader,
  icon,
  pageKey,
  backPageKey,
  journeyType,
  indicatorExists,
  isInStickOutPage,
}) => {
  const theme = useTheme();
  const { isMobile } = useResolution();
  const { customHeader } = useJourneyIndicatorContext();
  const CustomHeaderIcon = customHeader?.icon;
  const titleText = customHeader?.title || pageHeader;

  return (
    <Box id={id} position="relative" data-testid="header-title">
      {backPageKey && !indicatorExists && (
        <Box mb={6}>
          <BackButtonBlock
            isInStickOutPage={isInStickOutPage}
            pageKey={pageKey}
            journeyType={journeyType}
            backPageKey={backPageKey}
          />
        </Box>
      )}
      <Typography
        component="h1"
        display="flex"
        variant={isInStickOutPage || isMobile ? 'h3' : 'h1'}
        alignItems={isInStickOutPage || isMobile ? 'center' : 'flex-end'}
        sx={{
          '& span': {
            mt: isInStickOutPage || isMobile ? 2 : 0,
            lineHeight: theme => (isInStickOutPage || isMobile ? theme.typography.h3 : theme.typography.h1).fontSize,
          },
        }}
      >
        {!CustomHeaderIcon && icon?.renditions?.default?.url && (
          <Box
            mr={4}
            id="default-icon"
            display="inline-block"
            height={isInStickOutPage ? 48 : 60}
            width={isInStickOutPage ? 48 : 60}
            marginRight={{ xs: isInStickOutPage ? 12 : 15, md: 4 }}
            position="relative"
          >
            <Box height={isInStickOutPage ? 48 : 60} width={isInStickOutPage ? 48 : 60} position="absolute">
              <SvgIcon
                icon={icon}
                height={isInStickOutPage ? 48 : 60}
                width={isInStickOutPage ? 48 : 60}
                color={theme.palette.primary.main}
              />
            </Box>
          </Box>
        )}
        {CustomHeaderIcon && (
          <Box
            mr={4}
            id="custom-icon"
            display="inline-block"
            height={isInStickOutPage ? 48 : 60}
            width={isInStickOutPage ? 48 : 60}
            position="relative"
          >
            <Box
              position="absolute"
              height={isInStickOutPage ? 48 : 60}
              width={isInStickOutPage ? 48 : 60}
              sx={isInStickOutPage ? { '& div': { pt: 0 }, '& svg': { height: 48, width: 48 } } : {}}
            >
              <CustomHeaderIcon />
            </Box>
          </Box>
        )}
        {titleText}
      </Typography>
    </Box>
  );
};
