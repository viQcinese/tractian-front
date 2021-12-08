import * as React from 'react';

type RenderDataPropChildren<TData> = (data: TData) => React.ReactNode;

type QueryResultResolvedProps<TData> = {
  data: TData | undefined;
  children?: React.ReactNode | RenderDataPropChildren<TData>;
};

const Resolved = function QueryResultResolved<TData>(
  props: QueryResultResolvedProps<TData>
) {
  const { children = null, data } = props;

  if (typeof children === 'function' && data) {
    return children(data);
  }

  return data ? children : null;
};

type QueryResultPendingProps = {
  loading: boolean;
  children?: React.ReactNode;
};

const Pending = function QueryResultPending(props: QueryResultPendingProps) {
  const { children = null, loading } = props;
  return loading ? <>{children}</> : null;
};

type RenderErrorPropChildren<TError> = (data: TError) => React.ReactNode;

type QueryResultRejectedProps<TError> = {
  error: TError | undefined;
  children?: React.ReactNode | RenderErrorPropChildren<TError>;
};

const Rejected = function QueryResultRejected<TError>(
  props: QueryResultRejectedProps<TError>
) {
  const { children = null, error } = props;

  if (typeof children === 'function' && error) {
    return children(error);
  }

  return error ? children : null;
};

export default { Resolved, Pending, Rejected };
