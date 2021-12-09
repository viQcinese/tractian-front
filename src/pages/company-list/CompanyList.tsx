import * as React from 'react';
import { Typography, Card, Button, Spin } from 'antd';
import Layout from '../../components/layout/Layout';
import { useHistory } from 'react-router';
import useGetData from '../../hooks/useGetData';
import { Company } from '../../types/api';

const { Title } = Typography;

export default function PageCompanyList() {
  const { data, loading } = useGetData<Company[]>('companies');
  const history = useHistory();

  function onCompanyClick(id: number) {
    history.push(`/empresas/${id}`);
  }

  return (
    <Layout>
      <Title>Empresas Cadastradas</Title>
      {loading ? (
        <div className="spin-container">
          <Spin size="large" />
        </div>
      ) : (
        <div className="company-grid">
          {data?.map((company: Company) => (
            <CompanyCard
              key={company.id}
              onClick={onCompanyClick}
              {...company}
            />
          ))}
        </div>
      )}
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
    <Card
      title={name}
      hoverable
      // actions={[
      //   <Button key={1} type="text" block onClick={() => onClick(id)}>
      //     Ver Detalhes
      //   </Button>,
      // ]}
    >
      <Button key={1} type="text" block onClick={() => onClick(id)}>
        Ver Detalhes
      </Button>
    </Card>
  );
}
