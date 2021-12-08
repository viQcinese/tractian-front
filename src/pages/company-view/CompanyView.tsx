import * as React from 'react';
import { Button, Result, Skeleton, Tabs, Typography } from 'antd';
import Layout from '../../components/layout/Layout';
import UnitsTab from '../../components/page-company-view/UnitsTab';
import useRemoteData from '../../hooks/useRemoteData';
import { useHistory, useParams } from 'react-router';
import QueryResult from '../../components/query-result/QueryResult';
import './CompanyView.css';
import { Company } from '../../types/api';
import UsersTab from '../../components/page-company-view/UsersTab';
import AssetsTab from '../../components/page-company-view/AssetsTab';
const { Title } = Typography;

type PageCompanyRouteParams = {
  companyId: string;
  companyTab: string;
};

export default function PageCompanyView() {
  const { companyId, companyTab } = useParams<PageCompanyRouteParams>();
  const { data, loading, error, refetch } = useRemoteData<Company>(
    `companies/${companyId}`
  );
  const history = useHistory();

  function handleTabChange(key: string) {
    const targetTab = tabs.find((tab) => tab.key === key)?.name || 'ativos';
    history.push(`/empresas/${companyId}/${targetTab}`);
  }

  const activeTab =
    tabs.find((tab) => tab.name === companyTab)?.key || 'assets';

  return (
    <Layout>
      <QueryResult.Resolved data={data}>
        <Title>
          {data?.name} #{data?.id}
        </Title>
      </QueryResult.Resolved>
      <QueryResult.Pending loading={loading}>
        <Skeleton paragraph={{ rows: 0 }} />
      </QueryResult.Pending>
      {data || loading ? (
        <Tabs
          onChange={handleTabChange}
          defaultActiveKey="assets"
          activeKey={activeTab}
        >
          <Tabs.TabPane tab="Unidades" key="units">
            <UnitsTab companyId={companyId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Usuários" key="users">
            <UsersTab companyId={companyId} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Ativos" key="assets">
            <AssetsTab companyId={companyId} />
          </Tabs.TabPane>
        </Tabs>
      ) : error ? (
        <Result
          status="500"
          title="Oops!Ago errado aconteceu."
          subTitle="Não conseguimos buscar os dados que foram solicitados."
          extra={
            <Button type="primary" onClick={() => refetch()}>
              Tentar Novamente
            </Button>
          }
        />
      ) : null}
    </Layout>
  );
}

const tabs = [
  { key: 'units', name: 'unidades' },
  { key: 'users', name: 'usuarios' },
  { key: 'assets', name: 'ativos' },
];
