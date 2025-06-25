import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DialogElement } from '../../../api/content/types/common';
import { openInNewTab } from '../../../business/navigation';
import { callToActionValuesToCmsButtons } from '../../../cms/parse-cms';
import { CmsButton } from '../../../cms/types';
import { DialogBox, InformationModal } from '../../../components';
import { isWebChatActive } from '../../genesys';
import { useRouter } from '../../router';
import { useGlobalsContext } from '../GlobalsContext';
import { DialogContextModal } from './DialogContextModal';

export type CustomDialogElement = DialogElement & {
  customOnClick?: AsyncFunction | VoidFunction;
  customOnClose?: AsyncFunction | VoidFunction;
};

const context = createContext<{
  isDialogOpen: boolean;
  openDialog(element: CustomDialogElement): void;
  closeDialog(): void;
  loading: boolean;
}>(undefined as any);

interface Props {
  loading?: boolean;
  dialogOnLoad?: DialogElement;
}

export const useDialogContext = () => {
  if (!context) {
    throw new Error('DialogContextProvider should be used');
  }
  return useContext(context);
};

export const DialogContextProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  loading,
  dialogOnLoad,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogElement, setDialogElement] = useState<CustomDialogElement>();
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();
  const { labelByKey } = useGlobalsContext();
  const isAlternateStyle = !!dialogElement?.value?.elements?.showInAlternateStyle?.value;
  const hideCloseInAlternateStyle = !!dialogElement?.value?.elements?.hideCloseInAlternateStyle?.value;
  const isButtonLoading = router.loading || router.parsing || actionLoading;
  const modalSubContent = isWebChatActive() ? labelByKey('webchat_active_session') : undefined;
  const hideCloseButton = !!dialogElement?.value?.elements?.hideModalCloseButton?.value;

  useEffect(() => {
    if (loading) {
      handleForcedClose();
      return;
    }
    if (dialogOnLoad?.value?.elements) {
      handleOpen(dialogOnLoad);
      return;
    }
    handleForcedClose();
    return () => {
      handleForcedClose();
    };
  }, [dialogOnLoad?.value?.elements, router.asPath, loading]);

  return (
    <context.Provider
      value={useMemo(
        () => ({
          isDialogOpen: isOpen,
          loading: actionLoading,
          openDialog: handleOpen,
          closeDialog: handleClose,
        }),
        [isOpen, actionLoading],
      )}
    >
      {children}
      {!isAlternateStyle ? (
        <DialogBox
          open={isOpen && !!dialogElement && !loading}
          handleClose={handleClose}
          header={dialogElement?.value?.elements?.header?.value}
          loading={router.loading || router.parsing}
          hideCloseButton={hideCloseButton}
        >
          <DialogContextModal
            dialogElement={dialogElement}
            isButtonLoading={isButtonLoading}
            sourceUrl={dialogElement?.value?.elements?.dataSourceUrl?.value}
            handleButtonClick={handleButtonClick}
            handleClose={handleClose}
            modalSubContent={modalSubContent}
          />
        </DialogBox>
      ) : (
        <InformationModal
          open={isOpen}
          onClose={handleClose}
          header={dialogElement?.value?.elements?.header?.value}
          text={dialogElement?.value?.elements?.text?.value ?? ''}
          buttons={callToActionValuesToCmsButtons(dialogElement?.value?.elements?.callToAction?.values ?? [])}
          isAlternateStyle={isAlternateStyle}
          hideCloseInAlternateStyle={hideCloseInAlternateStyle}
          panel={dialogElement?.value?.elements?.panel?.value}
        />
      )}
    </context.Provider>
  );

  async function handleClose() {
    if (router.loading || router.parsing || hideCloseButton) {
      return;
    }
    if (dialogElement?.customOnClose) {
      setActionLoading(true);
      await dialogElement.customOnClose();
      setActionLoading(false);
    }
    setIsOpen(false);
  }

  async function handleForcedClose() {
    setIsOpen(false);
    setDialogElement(undefined);
  }

  function handleOpen(element: CustomDialogElement) {
    setDialogElement(element);
    setIsOpen(true);
  }

  function handleButtonClick(button: CmsButton) {
    return async () => {
      if (dialogElement?.customOnClick) {
        setActionLoading(true);
        await dialogElement.customOnClick();
        setActionLoading(false);
        return;
      }
      if (button.pageKey) {
        return router.parseUrlAndPush(button.pageKey);
      }
      if (button.link) {
        return button.openInTheNewTab ? openInNewTab(button.link) : await router.push(button.link);
      }
    };
  }
};
