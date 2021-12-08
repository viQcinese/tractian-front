import * as React from 'react';
import { Typography, Card, Button } from 'antd';
import Layout from '../../components/layout/Layout';
import './CompanyList.css';
import { useHistory } from 'react-router';
import useRemoteData from '../../hooks/useRemoteData';
import { Company } from '../../types/api';
import QueryResult from '../../components/query-result/QueryResult';

const { Title } = Typography;

export default function PageCompanyList() {
  const { data } = useRemoteData<Company[]>('companies');
  const history = useHistory();

  function onCompanyClick(id: number) {
    history.push(`/empresas/${id}`);
  }

  return (
    <Layout>
      <Title>Empresas Cadastradas</Title>
      <div className="company-grid">
        <QueryResult.Resolved data={data}>
          {data?.map((company: Company) => (
            <CompanyCard
              key={company.id}
              onClick={onCompanyClick}
              {...company}
            />
          ))}
        </QueryResult.Resolved>
      </div>
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
