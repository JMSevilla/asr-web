import CloseIcon from '@mui/icons-material/Close';
import { Breakpoint, Dialog, DialogContent, DialogProps, Grid, IconButton, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { CmsTenant } from '../api/content/types/tenant';
import { externalImageLoader } from '../business/images';
import { CmsButton } from '../cms/types';
import { useGlobalsContext } from '../core/contexts/GlobalsContext';
import { useCachedCmsAsset } from '../core/hooks/useCmsAsset';
import { useResolution } from '../core/hooks/useResolution';
import { useRouter } from '../core/router';
import { Button, PrimaryButton, SecondaryButton } from './buttons';

interface Props extends DialogProps {
  topCloseButton?: boolean;
  bottomCloseButton?: boolean;
  isBottomCloseButtonVisibleXS?: boolean;
  hideCloseInAlternateStyle?: boolean;
  headerBackgroundColor?: string;
  headerColor?: string;
  headerTitle?: string;
  tenant?: CmsTenant | null;
  showBottomActionButtons?: boolean;
  bottomActionButtons?: CmsButton[];
  maxWidth?: false | Breakpoint;
  disableTopPadding?: boolean;
}

export const Modal: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  onClose,
  topCloseButton,
  bottomCloseButton,
  isBottomCloseButtonVisibleXS,
  hideCloseInAlternateStyle,
  headerBackgroundColor = '#ffffff',
  headerColor = '#000000',
  headerTitle,
  tenant,
  showBottomActionButtons,
  bottomActionButtons,
  maxWidth = false,
  disableTopPadding = false,
  ...props
}) => {
  const router = useRouter();
  const { labelByKey } = useGlobalsContext();
  const { isMobile } = useResolution();
  const logo = isMobile
    ? tenant?.mobileLogo?.renditions?.default
    : tenant?.whiteLogo?.renditions?.default ?? tenant?.tenantLogo?.renditions?.default;
  const image = useCachedCmsAsset(logo?.url);

  return (
    <Dialog
      {...props}
      onClose={onClose}
      maxWidth={maxWidth}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      sx={{ margin: 0, ...props.sx }}
      PaperProps={{ sx: { borderRadius: 0, mx: { xs: 4, md: 0 } }, ...props.PaperProps }}
    >
      {((topCloseButton && onClose) || headerTitle) && (
        <Stack
          direction="row"
          justifyContent={headerTitle || logo ? 'space-between' : 'flex-end'}
          alignItems={logo ? 'center' : 'flex-start'}
          pt={{ xs: 4, md: 8 }}
          px={{ xs: 4, md: 12 }}
          pb={logo ? { xs: 4, md: 8 } : 0}
          sx={{ backgroundColor: headerBackgroundColor }}
        >
          {logo && image && (
            <Image
              src={image}
              loader={externalImageLoader}
              width={logo.width}
              height={logo.height}
              alt="company-logo"
            />
          )}
          {headerTitle && (
            <Typography id="dialog-title" align="left" variant="h2" mr={4}>
              {headerTitle}
            </Typography>
          )}
          {topCloseButton && onClose && (
            <IconButton
              size="small"
              onClick={() => onClose({}, 'backdropClick')}
              data-testid="modal-close-button"
              aria-label={labelByKey('aria_label_close_button')}
            >
              <CloseIcon fontSize="large" sx={{ color: headerColor }} />
            </IconButton>
          )}
        </Stack>
      )}
      <DialogContent
        sx={{
          paddingX: { md: 12, xs: 4 },
          paddingTop: disableTopPadding ? 0 : { md: 12, xs: 4 },
          paddingBottom: showBottomActionButtons && onClose ? 4 : { md: 12, xs: 4 },
        }}
        id="dialog-description"
      >
        {children}
      </DialogContent>
      {!showBottomActionButtons && bottomCloseButton && !hideCloseInAlternateStyle && onClose && (
        <PrimaryButton
          sx={{ padding: 1, display: { xs: !isBottomCloseButtonVisibleXS ? 'none' : 'flex', md: 'flex' } }}
          onClick={() => onClose({}, 'backdropClick')}
        >
          {labelByKey('close')}
        </PrimaryButton>
      )}
      {showBottomActionButtons && onClose && (
        <Grid
          container
          spacing={4}
          sx={{ paddingX: { md: 12, xs: 4 }, paddingBottom: { md: 12, xs: 4 }, paddingTop: 4 }}
        >
          {!!bottomActionButtons?.length &&
            bottomActionButtons.map((button, index) => {
              return (
                <Grid item key={index}>
                  <Button onClick={handleClick(button)} loading={router.loading || router.parsing} {...button}>
                    {button.text}
                  </Button>
                </Grid>
              );
            })}
          <Grid item>
            <SecondaryButton onClick={() => onClose({}, 'backdropClick')}>{labelByKey('close')}</SecondaryButton>
          </Grid>
        </Grid>
      )}
    </Dialog>
  );

  function handleClick(button: CmsButton) {
    return async () => {
      if (button.pageKey) {
        await router.parseUrlAndPush(button.pageKey);
        return;
      }

      if (!button.link) {
        return;
      }

      await router.push(button.link);
    };
  }
};
