import { Link, LinkProps, SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { JourneyTypeSelection } from '../../api/content/types/page';
import { usePopupContext } from '../../core/contexts/PopupContextProvider';
import { useTenantContext } from '../../core/contexts/TenantContext';
import { useCustomAction } from './hooks/useCustomAction';

interface Props extends LinkProps {
  disabled?: boolean;
  fileUrl?: string;
  linkKey?: string;
  pageKey?: string;
  journeyType?: JourneyTypeSelection;
  text?: string | React.ReactNode;
  customActionKey?: string;
  notification?: string;
  'data-testid'?: string;
  sx?: SxProps<Theme>;
  linkRef?: React.RefObject<HTMLAnchorElement>;
  customActionParams?: string;
}

export const LinkButton: React.FC<Props> = ({
  id,
  width,
  disabled,
  fileUrl,
  href,
  onClick,
  customActionKey,
  customActionParams,
  text,
  linkKey,
  pageKey,
  journeyType,
  notification,
  sx,
  linkRef,
  ...props
}) => {
  const popup = usePopupContext();
  const { tenant } = useTenantContext();
  const action = useCustomAction({
    actionKey: customActionKey,
    linkKey,
    pageKey,
    journeyType,
    shouldNavigate: !onClick,
    params: customActionParams,
  });
  const increasedAccessibility = tenant?.increasedAccessibility?.value;

  return (
    <>
      <Link
        id={id}
        ref={linkRef}
        data-testid={props['data-testid'] || id}
        custom-action-key={customActionKey}
        width={width}
        component={disabled ? 'button' : 'a'}
        variant="body1"
        disabled={disabled}
        href={fileUrl || href}
        onClick={handleClick}
        fontSize={increasedAccessibility ? 'accessibleText.fontSize' : props.fontSize}
        fontWeight={increasedAccessibility ? 'accessibleText.fontWeight' : 'unset'}
        sx={{
          ...sx,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </Link>
      {action?.node}
    </>
  );

  async function handleClick(e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>) {
    if (disabled) {
      e.preventDefault();
      return;
    }

    if (action?.execute || onClick) {
      e.preventDefault();
      notification && popup.show(notification);
      action && (await action.execute());
      !action?.disableFurtherActions && onClick && onClick(e);
    }
  }
};
