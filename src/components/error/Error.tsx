import { Button, Result } from 'antd';
import * as React from 'react';

type ErrorProps = {
  children?: string;
  refetch?: () => void;
};

export default function Error(props: ErrorProps) {
  const { children, refetch } = props;
  return (
    <Result
      status="500"
      title="Oops! Algo errado aconteceu."
      subTitle={
        children ||
        'Desculpe, mas não foi possível buscar as informações solicitadas.'
      }
      extra={
        refetch ? (
          <Button type="primary" onClick={() => refetch()}>
            Tentar Novamente
          </Button>
        ) : null
      }
    />
  );
}
