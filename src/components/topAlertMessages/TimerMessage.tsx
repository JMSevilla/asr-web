import { Box, Button, Grid } from '@mui/material';
import { ButtonType } from '../../api/content/types/common';
import { useResolution } from '../../core/hooks/useResolution';
import { useRouter } from '../../core/router';
import { ParsedHtml } from '../ParsedHtml';
import { MessageIconBox } from '../blocks/messages/MessageIconBox';
import { ClockIcon } from '../icons';
import { messageRole } from './roles';
import { MessageType } from './types';

interface Props {
  type: MessageType;
  html?: string;
  fromQuery?: boolean;
  icon?: string;
  buttons?: {
    link: string;
    text: string;
    type: ButtonType;
  }[];
}

export const TimerMessage: React.FC<React.PropsWithChildren<Props>> = ({
  type,
  children,
  html,
  buttons,
  fromQuery,
}) => {
  const router = useRouter();
  const { isMobile } = useResolution();

  return (
    <Grid
      role={messageRole(type)}
      data-testid="timer-message-component"
      container
      p={4}
      justifyContent="center"
      alignItems="center"
      sx={{
        borderStyle: 'none',
        color: type === MessageType.Warning ? 'black' : 'white',
        backgroundColor: theme =>
          ({
            [MessageType.Info]: theme.palette.success.main,
            [MessageType.Success]: theme.palette.success.main,
            [MessageType.Problem]: theme.palette.error.main,
            [MessageType.Warning]: theme.palette.warning.main,
            [MessageType.PrimaryTenant]: theme.palette.primary.main,
            [MessageType.Note]: theme.palette.warning.light,
          }[type]),
      }}
    >
      <Grid
        item
        container
        wrap="nowrap"
        alignItems="center"
        px={isMobile ? 0 : 8}
        sx={{
          maxWidth: theme => theme.sizes.contentWidth,
        }}
        direction={isMobile ? 'column' : 'row'}
      >
        {!isMobile && (
          <Grid item alignItems="center">
            <Box display="flex">
              <MessageIconBox
                icon={fromQuery ? undefined : <ClockIcon customColor="white" />}
                type={type}
                size="large"
                inheritColor
              />
            </Box>
          </Grid>
        )}

        <Grid item container ml={4} mb={isMobile && buttons ? 4 : 0}>
          {children && (
            <Grid item xs={12}>
              {children}
            </Grid>
          )}
          {html && (
            <Grid item xs={12} sx={{ '& p': { margin: 0 } }}>
              <ParsedHtml html={html} disableEmptyLineRule />
            </Grid>
          )}
        </Grid>
        {buttons && (
          <Grid item container justifyContent="flex-end" spacing={1}>
            {buttons.map((button, index) => (
              <Grid item key={index} ml={isMobile ? 0 : 4} xs={6} md="auto">
                <Button
                  size="small"
                  fullWidth={isMobile}
                  sx={{
                    border: '2px solid ',
                    lineHeight: 1,
                    borderColor: theme =>
                      button.type === 'Primary'
                        ? type === MessageType.Warning
                          ? theme.palette.common.black
                          : theme.palette.common.white
                        : 'transparent',
                    color: theme =>
                      ({
                        [MessageType.Info]: theme.palette.common.white,
                        [MessageType.Success]: theme.palette.common.white,
                        [MessageType.Problem]: theme.palette.common.white,
                        [MessageType.Warning]: theme.palette.common.black,
                        [MessageType.PrimaryTenant]: theme.palette.common.white,
                        [MessageType.Note]: theme.palette.common.white,
                      }[type]),
                    '&:hover': {
                      backgroundColor: type === MessageType.Warning ? 'black' : 'white',
                      color: theme =>
                        ({
                          [MessageType.Info]: theme.palette.success.main,
                          [MessageType.Success]: theme.palette.success.main,
                          [MessageType.Problem]: theme.palette.error.main,
                          [MessageType.Warning]: theme.palette.warning.main,
                          [MessageType.PrimaryTenant]: theme.palette.primary.main,
                          [MessageType.Note]: theme.palette.warning.light,
                        }[type]),
                    },
                  }}
                  onClick={() => button?.link && router.push(button.link)}
                >
                  {button.text}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
