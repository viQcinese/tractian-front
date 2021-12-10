import * as React from 'react';
import { Typography, Card, Button, Spin } from 'antd';
import Layout from '../../components/layout/Layout';
import Error from '../../components/error/Error';
import { Company } from '../../types/api';
import { useHistory } from 'react-router';
import useGetData from '../../hooks/useGetData';

export default function PageCompanyList() {
  const { data, loading, error, refetch } = useGetData<Company[]>('companies');
  const history = useHistory();

  function onCompanyClick(id: number) {
    history.push(`/empresas/${id}`);
  }

  React.useEffect(() => {
    document.title = `Empresas Cadastradas — Tractian`;
  }, []);

  return (
    <Layout>
      <Typography.Title>Empresas Cadastradas</Typography.Title>
      {loading ? (
        <div className="spin-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Error refetch={refetch} />
      ) : data ? (
        <div className="company-grid">
          {data?.map((company: Company) => (
            <CompanyCard
              key={company.id}
              onClick={onCompanyClick}
              {...company}
            />
          ))}
        </div>
      ) : null}
    </Layout>
  );
}

type CompanyCardProps = {
  name: string;
  id: number;
  onClick: (id: number) => void;
};

function CompanyCard(props: CompanyCardProps) {
  const { name, id, onClick } = props;

  return (
    <Card title={name} hoverable>
      <Button key={1} type="text" block onClick={() => onClick(id)}>
        Ver Detalhes
      </Button>
    </Card>
  );
}
