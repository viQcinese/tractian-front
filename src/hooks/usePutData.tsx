import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../utils/constants';

type PutDataConfig<TData> = {
  onCompleted?: (response: AxiosResponse<TData>) => void;
  onError?: (error: unknown) => void;
};

type PutData = {
  data?: unknown;
  loading?: boolean;
  error?: unknown;
};

type PostTupple<TData> = [(data: TData) => void, PutData];

export default function usePutData<TData>(
  path: string,
  config?: PutDataConfig<TData>
): PostTupple<TData> {
  const [data, setData] = React.useState<AxiosResponse>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>();

  async function putData(data: TData) {
    setLoading(true);
    setError(undefined);

    try {
      const response = await axios.put<TData>(`${API_URL}/${path}`, data);
      setData(response);
      if (config?.onCompleted) {
        config.onCompleted(response);
      }
    } catch (error) {
      setError(error);
      if (config?.onError) {
        config.onError(error);
      }
    }
    setLoading(false);
  }

  return [putData, { data, loading, error }];
}
