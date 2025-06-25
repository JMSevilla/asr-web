import { Box } from '@mui/material';
import { Link } from '..';
import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { useDialogContext } from '../../core/contexts/dialog/DialogContext';

interface Props {
  id?: string;
  href?: string;
  shouldNavigateToNewTab: boolean;
  disableNavigation?: boolean;
}

export const HeaderLogoNavigation: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  href,
  shouldNavigateToNewTab,
  children,
  disableNavigation = false,
}) => {
  if (disableNavigation) {
    return <>{children}</>;
  }

  const { dialogByKey } = useGlobalsContext();
  const dialog = useDialogContext();
  const logoDialog = dialogByKey('logo_dialog');

  if (logoDialog) {
    return (
      <Box
        sx={{ cursor: 'pointer' }}
        data-testid={id || 'header_logo_button'}
        onClick={() => logoDialog && dialog.openDialog(logoDialog)}
      >
        {children}
      </Box>
    );
  }

  return (
    <Link naked href={href} as={href} target={shouldNavigateToNewTab ? '_blank' : '_self'}>
      {children}
    </Link>
  );
};
