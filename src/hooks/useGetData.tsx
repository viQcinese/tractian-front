import axios from 'axios';
import * as React from 'react';
import { API_URL } from '../utils/constants';

type GetDataConfig<TData> = {
  onCompleted?: (data: TData) => void;
  onError?: (error: unknown) => void;
  shouldGet?: boolean;
};

export default function useGetData<TData>(
  path: string,
  config?: GetDataConfig<TData>
) {
  const shouldGet = config?.shouldGet === false ? false : true;
  const [data, setData] = React.useState<TData>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>();
  const [refetchCounter, setRefetchCounter] = React.useState(0);

  function refetch() {
    setRefetchCounter((prev) => prev + 1);
  }

  React.useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const response = await axios.get<TData>(`${API_URL}/${path}`);
        setData(response.data);
        if (config?.onCompleted) {
          config.onCompleted(response.data);
        }
      } catch (error) {
        setError(error);
        if (config?.onError) {
          config.onError(error);
        }
      }
      setLoading(false);
    };

    if (shouldGet) {
      getData();
    }

    return function cleanup() {
      setData(undefined);
      setLoading(false);
      setError(undefined);
    };
  }, [path, refetchCounter]);

  return { data, loading, error, refetch };
}
