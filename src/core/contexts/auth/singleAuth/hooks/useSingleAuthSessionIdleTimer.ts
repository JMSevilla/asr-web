import { useIdleTimer } from 'react-idle-timer';
import { config } from '../../../../../config';

interface Props {
  onSessionExpired: AsyncFunction;
}

export const useSingleAuthSessionIdleTimer = ({ onSessionExpired }: Props) => {
  const timeoutMinutes = config.value.SINGLE_AUTH_IDLE_TIMEOUT_MINUTES || 10

  const idleTimer = useIdleTimer({
    onIdle: handleSessionExpiration,
    startManually: true,
    stopOnIdle: true,
    debounce: 400,
    timeout: timeoutMinutes * 60000,
  });

  function startIdleTimer() {
    idleTimer.start();
  }

  function stopIdleTimer() {
    idleTimer.message({}, false);
    idleTimer.reset();
  }

  async function handleSessionExpiration() {
    await onSessionExpired();
  }

  return { start: startIdleTimer, stop: stopIdleTimer };
};
