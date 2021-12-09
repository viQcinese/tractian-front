import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../utils/constants';

type DeleteDataConfig = {
  onCompleted?: (response: AxiosResponse) => void;
  onError?: (error: unknown) => void;
};

type DeleteData = {
  data?: unknown;
  loading?: boolean;
  error?: unknown;
};

type PostTupple = [() => void, DeleteData];

export default function useDeleteData(
  path: string,
  config?: DeleteDataConfig
): PostTupple {
  const [data, setData] = React.useState<AxiosResponse>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>();

  async function deleteData() {
    setLoading(true);
    setError(undefined);

    try {
      const response = await axios.delete(`${API_URL}/${path}`, data);
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

  return [deleteData, { data, loading, error }];
}
