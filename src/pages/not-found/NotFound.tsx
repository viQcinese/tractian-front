import * as React from 'react';
import { Result, Button } from 'antd';
import Layout from '../../components/layout/Layout';
import { useHistory } from 'react-router';

export default function PageNotFound() {
  const history = useHistory();

  function redirectToHome() {
    history.push('/');
  }

  React.useEffect(() => {
    document.title = `Página não encontrada — Tractian`;
  }, []);

  return (
    <Layout>
      <Result
        status="404"
        title="Oops! Desculpe, não encontramos essa página!"
        subTitle="A página que você está acessando não existe ou está temporariamente
        indisponível. Considere retornar para a página inicial."
        extra={
          <Button type="primary" onClick={redirectToHome}>
            Página Inicial
          </Button>
        }
      />
    </Layout>
  );
}
