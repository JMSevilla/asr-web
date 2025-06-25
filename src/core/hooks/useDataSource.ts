import { DataSource } from '../../api/mdp/types';
import { useApi } from './useApi';

interface Props {
  url?: string;
  params?: DataSource;
}

export const useDataSource = ({ url, params }: Props) => {
  const dataSource = useApi(api => (url ? api.mdp.dataSummary(url, params ?? {}) : Promise.reject()));

  const status = {
    isError: !!(url && dataSource.error ),
    isSuccess: !!(url && dataSource.result?.status === 200),
    isEmpty: !url || dataSource.result?.status === 204,
    isLoading: dataSource.loading,
  };

  return { dataSource, ...status };
};

export type DataSourceTypes = ReturnType<typeof useDataSource>

