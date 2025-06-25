import { Grid, Stack, useTheme } from '@mui/material';
import { ContentButtonBlock, ListLoader, ParsedHtml } from '../..';
import { useResolution } from '../../../core/hooks/useResolution';
import { MessageType } from '../../topAlertMessages';
import { MessageIconBox } from './MessageIconBox';
import { MessageProps } from './types';

type Props = MessageProps & { section?: boolean };

export const Message: React.FC<Props> = ({
  id,
  type = MessageType.Info,
  html,
  icon,
  buttons,
  loading,
  section,
  dataReplaceProps,
}) => {
  const { isMobile } = useResolution();
  const theme = useTheme();
  const isExistsButtons = !!buttons?.length;

  if (loading) return <ListLoader data-testid="message-loader" loadersCount={1} />;

  return (
    <Grid
      id={id}
      data-testid="message-component"
      container
      alignItems="center"
      p={6}
      gap={{ xs: 4, md: 6 }}
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
        position: 'relative',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: borderColor(),
        backgroundColor: backgroundColor(),
        '& a': { color: 'inherit' },
        '&:before': {
          content: "''",
          position: 'absolute',
          top: 0,
          left: 0,
          width: { xs: '100%', md: '4px' },
          height: { xs: '4px', md: '100%' },
          backgroundColor: borderColor(),
        },
      }}
      {...dataReplaceProps?.(id, html)}
      {...(section ? { component: 'section' } : { role: 'mark' })}
    >
      {type && type !== MessageType.Note && (
        <Grid item width={{ xs: '100%', sm: 24 }} display="flex" justifyContent="center">
          <MessageIconBox icon={icon} type={type} size="medium" />
        </Grid>
      )}
      <Stack gap={isExistsButtons ? 4 : 0} flex={1}>
        {html && (
          <Grid>
            <ParsedHtml
              html={html}
              isWithMargin={false}
              disableEmptyLineRule
              sx={isMobile ? { '*': { fontSize: '1rem!important' } } : {}}
            />
          </Grid>
        )}
        <Grid container display="flex" gap={4}>
          {buttons?.map((button, idx) => (
            <Grid
              item
              key={idx}
              width={isMobile ? '100%' : button.widthPercentage ? `${button.widthPercentage}%` : 'unset'}
            >
              <ContentButtonBlock
                {...button}
                journeyType={button?.journeyType}
                widthPercentage={isMobile ? 100 : button.widthPercentage ? 100 : undefined}
                sxProps={{
                  border: '2px solid ',
                  lineHeight: 1,
                  borderColor: button.type === 'Primary' ? textColor() : 'transparent',
                  backgroundColor: 'transparent',
                  color: `${textColor()}!important`,
                  boxShadow: 'none',
                  fontSize: theme => (isMobile ? theme.typography.body2.fontSize : theme.typography.body1.fontSize),
                  '&:hover': {
                    backgroundColor: textColor(),
                    color: `${hoveredTextColor()}!important`,
                    borderColor: 'transparent',
                    '& #icon': {
                      backgroundColor: hoveredTextColor(),
                    },
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Grid>
  );

  function textColor() {
    return {
      [MessageType.Info]: theme.palette.success.main,
      [MessageType.Success]: theme.palette.success.main,
      [MessageType.Problem]: theme.palette.error.main,
      [MessageType.Warning]: theme.palette.common.black,
      [MessageType.PrimaryTenant]: theme.palette.primary.main,
      [MessageType.Note]: theme.palette.common.black,
    }[type];
  }

  function hoveredTextColor() {
    return {
      [MessageType.Info]: theme.palette.common.white,
      [MessageType.Success]: theme.palette.common.white,
      [MessageType.Problem]: theme.palette.common.white,
      [MessageType.Warning]: theme.palette.warning.main,
      [MessageType.PrimaryTenant]: theme.palette.common.white,
      [MessageType.Note]: theme.palette.warning.main,
    }[type];
  }

  function borderColor() {
    return {
      [MessageType.Info]: theme.palette.success.main,
      [MessageType.Success]: theme.palette.success.main,
      [MessageType.Problem]: theme.palette.error.main,
      [MessageType.Warning]: theme.palette.warning.main,
      [MessageType.PrimaryTenant]: theme.palette.primary.main,
      [MessageType.Note]: theme.palette.warning.main,
    }[type];
  }

  function backgroundColor() {
    return {
      [MessageType.Info]: theme.palette.success.light,
      [MessageType.Success]: theme.palette.success.light,
      [MessageType.Problem]: theme.palette.error.light,
      [MessageType.Warning]: theme.palette.warning.light,
      [MessageType.PrimaryTenant]: theme.palette.primary.light,
      [MessageType.Note]: theme.palette.warning.light,
    }[type];
  }
};
