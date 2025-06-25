import { CircularProgress, Grid, SxProps, Theme, Typography, useTheme } from '@mui/material';
import React from 'react';
import { CmsButton } from '../../cms/types';
import { useTenantContext } from '../../core/contexts/TenantContext';
import { useApiCallback } from '../../core/hooks/useApi';
import { useResolution } from '../../core/hooks/useResolution';
import { useRouter } from '../../core/router';
import { MessageIconBox } from '../blocks/messages/MessageIconBox';
import { ContentButtonBlock, ParsedHtml } from '../index';
import { messageRole } from './roles';
import { MessageType } from './types';

interface Props {
  type: MessageType;
  html?: string;
  icon?: string;
  buttons?: CmsButton[];
  loading?: boolean;
  ariaProps?: object;
}

export const AlertMessage: React.FC<Props> = ({ type, html, buttons, loading, ariaProps, icon }) => {
  const router = useRouter();
  const theme = useTheme();
  const { tenant } = useTenantContext();
  const { isMobile } = useResolution();
  const parseUrlCb = useApiCallback((api, key: string) => api.content.urlFromKey(key));
  const isLoading = parseUrlCb.loading || router.loading || loading;
  const increasedAccessibility = tenant?.increasedAccessibility?.value;

  return (
    <Grid
      role={messageRole(type)}
      data-testid="alert-message-component"
      container
      p={4}
      justifyContent="center"
      alignItems="center"
      sx={{
        borderStyle: 'none',
        color: type === MessageType.Warning ? 'black' : 'white',
        '& a': { color: 'inherit' },
        backgroundColor: hoveredTextColor(),
      }}
      {...ariaProps}
    >
      <Grid
        item
        xs={12}
        container
        spacing={4}
        alignItems="center"
        px={isMobile ? 0 : 8}
        maxWidth={theme => theme.sizes.contentWidth + '!important'}
      >
        {html && (
          <Grid item flex={1} display="flex" alignItems="center" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
            <Typography color={textColor()} display="flex" alignItems="center">
              <MessageIconBox icon={icon} type={type} size="medium" inheritColor />
            </Typography>

            {isLoading && <CircularProgress size={30} sx={{ color: textColor() }} />}
            {!isLoading && html && (
              <ParsedHtml
                html={html}
                isWithMargin={false}
                disableEmptyLineRule
                fontSize={isMobile ? 'body2' : increasedAccessibility ? 'accessibleText.fontSize' : 'body1.fontSize'}
                sx={{
                  ...fontStyles(increasedAccessibility, isMobile),
                }}
              />
            )}
          </Grid>
        )}
        {!!buttons?.length && (
          <Grid item xs={12} md="auto" display="flex" gap={4} justifyContent="flex-end" flexWrap="nowrap">
            {buttons.map((button, index) => (
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
                  textDecorationColor: textColor(),
                  boxShadow: 'none',
                  fontSize: theme => (isMobile ? theme.typography.body2.fontSize : theme.typography.body1.fontSize),
                  '&:hover': {
                    backgroundColor: textColor(),
                    color: `${hoveredTextColor()}!important`,
                    textDecorationColor: hoveredTextColor(),
                    borderColor: 'transparent',
                    '& #icon': {
                      backgroundColor: hoveredTextColor(),
                    },
                  },
                }}
              />
            ))}
          </Grid>
        )}
      </Grid>
    </Grid>
  );

  function textColor() {
    return {
      [MessageType.Info]: theme.palette.common.white,
      [MessageType.Success]: theme.palette.common.white,
      [MessageType.Problem]: theme.palette.common.white,
      [MessageType.Warning]: theme.palette.common.black,
      [MessageType.PrimaryTenant]: theme.palette.common.white,
      [MessageType.Note]: theme.palette.common.white,
    }[type];
  }

  function hoveredTextColor() {
    return {
      [MessageType.Info]: theme.palette.success.main,
      [MessageType.Success]: theme.palette.success.main,
      [MessageType.Problem]: theme.palette.error.main,
      [MessageType.Warning]: theme.palette.warning.main,
      [MessageType.PrimaryTenant]: theme.palette.primary.main,
      [MessageType.Note]: theme.palette.warning.light,
    }[type];
  }
};

const fontStyles = (increasedAccessibility?: boolean, isMobile?: boolean): SxProps<Theme> =>
  isMobile
    ? {
        '& >p': {
          fontSize: theme => theme.typography.body2,
        },
      }
    : {
        fontSize: theme => (increasedAccessibility ? theme.typography.accessibleText : theme.typography.htmlFontSize),
      };
