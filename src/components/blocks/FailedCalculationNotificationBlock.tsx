import { useGlobalsContext } from '../../core/contexts/GlobalsContext';
import { ErrorBox } from '../ErrorBox';

export const FailedCalculationNotificationBlock: React.FC = () => {
  const { labelByKey } = useGlobalsContext();

  return <ErrorBox label={labelByKey('proj_error_message')} />;
};
