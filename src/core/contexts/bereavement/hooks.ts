import { addMinutes, differenceInMilliseconds, parseISO, subMinutes } from 'date-fns';
import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useCountdownTimer } from '../../hooks/useCountdownTimer';
import { useGlobalsContext } from '../GlobalsContext';
import { useDialogContext } from '../dialog/DialogContext';
import { usePersistentAppState } from '../persistentAppState/PersistentAppStateContext';
import { useBereavementSession } from './BereavementSessionContext';

interface Props {
  expirationDate: Date | null;
  onAboutToExpire: VoidFunction;
  onSessionExpired: AsyncFunction;
  onExtendSession(): Promise<void>;
}

const BEREAVEMENT_WARNING_EXPIRATION_TIME_MINUTES = 1;

export const useBereavementSessionIdleTimer = ({
  expirationDate,
  onAboutToExpire,
  onSessionExpired,
  onExtendSession,
}: Props) => {
  const [lastActiveDate, setLastActiveDate] = useState<string | undefined>(undefined);
  const timeUntilWarningIsShown = millisecondsCountMinutesUntilExpiration(
    expirationDate,
    BEREAVEMENT_WARNING_EXPIRATION_TIME_MINUTES,
  );

  useEffect(() => {
    if (expirationDate) {
      // setTimeout is needed to avoid a bug in react-idle-timer which causes calling onIdle action after the first timer activation.
      // This way it skips one animation time frame which is enough to avoid the bug.
      setTimeout(() => idleTimer.start(), 0);
    }
  }, [expirationDate]);

  const idleTimer = useIdleTimer({
    onIdle: async () => {
      if (sessionExpired(expirationDate)) {
        return await handleSessionExpiration();
      }
      onAboutToExpire();
    },
    onAction: async () => {
      if (!lastActiveDate) {
        resetLastActiveDate();
      }

      if (sessionExpired(expirationDate)) {
        return await handleSessionExpiration();
      }

      if (oneMinutePassed(lastActiveDate)) {
        resetLastActiveDate();
        await extendSession();
      }
    },
    startManually: true,
    stopOnIdle: true,
    debounce: 400,
    crossTab: true,
    syncTimers: 400,
    onMessage: handleSessionExpiration,
    name: typeof window !== 'undefined' ? window.tabId : undefined,
    timeout: timeUntilWarningIsShown,
  });

  async function startIdleTimer() {
    setLastActiveDate(undefined);
    await extendSession();
  }

  function stopIdleTimer() {
    setLastActiveDate(undefined);
    idleTimer.message({}, false);
    idleTimer.reset();
    idleTimer.pause();
  }

  async function extendSession() {
    try {
      await onExtendSession();
    } catch {
      await handleSessionExpiration();
    }
  }

  function resetLastActiveDate() {
    setLastActiveDate(new Date().toISOString());
  }

  async function handleSessionExpiration() {
    setLastActiveDate(undefined);
    await onSessionExpired();
  }

  return { start: startIdleTimer, stop: stopIdleTimer };
};

export const useBereavementSessionWarning = () => {
  const { dialogByKey } = useGlobalsContext();
  const { bereavement } = usePersistentAppState();
  const { resetSession, endSession } = useBereavementSession();
  const dialog = useDialogContext();
  const timer = useCountdownTimer(BEREAVEMENT_WARNING_EXPIRATION_TIME_MINUTES, dialog.isDialogOpen);

  useEffect(() => {
    if (bereavement.expiration.aboutToExpire && !dialog.isDialogOpen) {
      timer.reset();
      showExpirationWarningDialog();
    }
  }, [bereavement.expiration.aboutToExpire, dialog.isDialogOpen]);

  useEffect(() => {
    if (!timer.totalTimeInSeconds && dialog.isDialogOpen && bereavement.expiration.date) {
      endSession();
    }
  }, [timer.totalTimeInSeconds, dialog.isDialogOpen]);

  function showExpirationWarningDialog() {
    const warningDialog = dialogByKey('bereavement_expiration_warning');
    warningDialog &&
      dialog.openDialog({
        ...warningDialog,
        customOnClick: handleCustomWarningDialogAction,
        customOnClose: handleCustomWarningDialogAction,
      });
  }

  async function handleCustomWarningDialogAction() {
    timer.stop();
    await resetSession();
    dialog.closeDialog();
  }
};

const oneMinutePassed = (lastActiveDate?: string) =>
  lastActiveDate && new Date() >= addMinutes(parseISO(lastActiveDate), 1);

const sessionExpired = (expirationDate: Date | null) => expirationDate && new Date() >= expirationDate;

const millisecondsCountMinutesUntilExpiration = (expirationDate: Date | null, minutes: number) =>
  expirationDate ? differenceInMilliseconds(expirationDate, subMinutes(new Date(), -minutes)) : undefined;
