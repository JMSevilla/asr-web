import { ListLoader } from '../../';
import { UserPersonalDetails } from '../../../api/mdp/types';
import { formatDate } from '../../../business/dates';
import { toTitleCase } from '../../../business/strings';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApi } from '../../../core/hooks/useApi';
import { PersonalDetailsList } from './PersonalDetailsList';

interface Props {
  id?: string;
}

export const PersonalDetailsBlock: React.FC<Props> = ({ id }) => {
  const { labelByKey } = useGlobalsContext();
  const { result, loading, error } = useApi(api => api.mdp.userPersonalDetails());

  if (loading) {
    return <ListLoader id={id} loadersCount={2} />;
  }

  if (error) return null;

  return <PersonalDetailsList id={id} details={mapDetails(result!.data)} />;

  function mapDetails(data: UserPersonalDetails) {
    return {
      title: toTitleCase(data?.title),
      name: toTitleCase(data?.name),
      gender: data?.gender === 'F' ? labelByKey('female') : labelByKey('male') ?? '',
      dateOfBirth: data ? formatDate(data.dateOfBirth) : '',
    };
  }
};
