import axios from 'axios';
import * as React from 'react';
import { API_URL } from '../utils/constants';

export default function useRemoteData<TData>(path: string) {
  const [data, setData] = React.useState<TData>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refetchCounter, setRefetchCounter] = React.useState(0);

  function refetch() {
    setRefetchCounter((prev) => prev + 1);
  }

  React.useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/${path}`)
      .then((response) => {
        setLoading(false);
        setData(response.data);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });

    return function cleanup() {
      setData(undefined);
      setLoading(false);
      setError(undefined);
    };
  }, [path, refetchCounter]);

  return { data, loading, error, refetch };
}
