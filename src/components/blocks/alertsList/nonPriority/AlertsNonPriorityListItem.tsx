import { ChevronLeftRounded } from '@mui/icons-material';
import { Box, IconButton, Stack, SxProps, Typography } from '@mui/material';
import { formatDate, getUTCDate } from '../../../../business/dates';
import { NonPriorityAlert } from '../../../../core/contexts/alerts/types';
import { ParsedHtml } from '../../../ParsedHtml';

interface Props {
  alert: NonPriorityAlert;
  isOpen: boolean;
  onToggle: () => void;
}

export const AlertsNonPriorityListItem: React.FC<Props> = ({ alert, isOpen, onToggle }) => {
  return (
    <Box p={{ xs: 4, md: 8 }} borderRadius="8px" bgcolor="background.paper" component="section">
      <Stack
        data-accordion-opener
        direction="row"
        className="alert-header"
        position="relative"
        justifyContent="space-between"
        mb={2}
        sx={{
          cursor: alert.messageText ? 'pointer' : 'default',
          '& .alert-header-icon-button': {
            position: 'absolute',
            right: 0,
            top: 0,
            color: 'text.primary',
            bgcolor: 'appColors.support60.transparentLight',
            transition: 'all 0.3s ease-out',
            ...['height', 'minHeight', 'maxHeight', 'width', 'minWidth', 'maxWidth'].reduce(
              (acc, prop) => ({ ...acc, [prop]: { xs: '32px', md: '48px' } }),
              {},
            ),

            '&:active': {
              transform: 'scale(0.9)',
            },

            svg: {
              width: { xs: '26px', md: '34px' },
              height: 'auto',
            },
          },
          '&:hover, &:focus, &:active': {
            '& .alert-header-icon-button': {
              bgcolor: 'appColors.support60.light',
            },
          },
          '& .alert-header-icon-button:focus-visible': {
            bgcolor: 'appColors.support60.light',
            outline: theme => `2px solid ${theme.palette.appColors.ui_rag['Amber.400']}`,
          },
        }}
        onClick={alert.messageText ? onToggle : undefined}
      >
        <Typography
          component="h2"
          fontSize={{ xs: 'body2.fontSize', md: 'h3.fontSize' }}
          fontWeight="bold"
          maxWidth={isOpen ? '80%' : '100%'}
        >
          {alert.title}
        </Typography>
        {alert.messageText && (
          <IconButton
            disableRipple
            className="alert-header-icon-button"
            aria-expanded={isOpen}
            aria-controls={`alert-content-${alert.alertID}`}
          >
            <ChevronLeftRounded
              color="inherit"
              sx={{
                transform: isOpen ? 'rotate(90deg)' : 'rotate(-90deg)',
                transition: 'transform 0.3s ease-in-out',
              }}
            />
          </IconButton>
        )}
      </Stack>
      <Stack mb={{ xs: 0, md: 4 }} maxWidth="80%" className="alert-meta">
        <Typography
          className="alert-date"
          component="span"
          fontSize={{ xs: 'badge.fontSize', md: 'caption.fontSize' }}
          color="primary"
        >
          {formatDate(getUTCDate(alert.effectiveDate), 'dd MMM, yyyy')}
        </Typography>
      </Stack>
      <Box data-accordion-content className="alert-content" maxWidth="80%" id={`alert-content-${alert.alertID}`}>
        <ParsedHtml html={alert.introText} sx={{ display: { xs: 'none', md: 'inline' } }} />
        {alert.messageText && (
          <Box display={{ xs: 'none', md: 'grid' }} p={isOpen ? '1rem 0 0' : '0'} sx={collapsableGridSx(isOpen)}>
            <ParsedHtml html={alert.messageText} sx={collapsibleContentSx(isOpen)} />
          </Box>
        )}

        <Box display={{ xs: 'grid', md: 'none' }} mt={isOpen ? 4 : 0} sx={collapsableGridSx(isOpen)}>
          <ParsedHtml
            html={alert.introText + alert.messageText}
            sx={collapsibleContentSx(isOpen)}
            fontSize="body2.fontSize"
          />
        </Box>
      </Box>
    </Box>
  );
};

const collapsableGridSx = (isOpen: boolean, sx: SxProps = {}): SxProps => ({
  gridTemplateRows: isOpen ? '1fr' : '0fr',
  transition: 'all 0.3s ease-out',
  ...sx,
});

const collapsibleContentSx = (isOpen: boolean, sx: SxProps = {}): SxProps => ({
  overflow: 'hidden',
  opacity: isOpen ? 1 : 0,
  transition: 'opacity 0.3s ease-in-out',
  ...sx,
});
