import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../utils/constants';

type PostConfig<TData> = {
  onCompleted: (response: AxiosResponse, data: TData) => void;
};

type PostData = {
  data?: unknown;
  loading?: boolean;
  error?: Error;
};

type PostTupple<TData> = [(data: TData) => void, PostData];

export default function usePostData<TData>(
  path: string,
  config?: PostConfig<TData>
): PostTupple<TData> {
  const [data, setData] = React.useState<AxiosResponse>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error>();

  function postData(data: TData) {
    setLoading(true);
    axios
      .post(`${API_URL}/${path}`, data)
      .then((response) => {
        setData(response);
        config?.onCompleted(response, data);
      })
      .catch((error) => {
        setError(error);
      });
    setLoading(false);
  }

  return [postData, { data, loading, error }];
}
