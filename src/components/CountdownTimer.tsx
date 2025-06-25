import { useCountdownTimer } from '../core/hooks/useCountdownTimer';

interface Props {
  timeInMinutes: number;
}

export const CountdownTimer: React.FC<Props> = ({ timeInMinutes }) => {
  const { minutes, seconds } = useCountdownTimer(timeInMinutes);
  const minutesText = minutes < 10 ? `0${minutes}` : minutes;
  const secondsText = seconds < 10 ? `0${seconds}` : seconds;

  return <>{`${minutesText}:${secondsText}`}</>;
};
