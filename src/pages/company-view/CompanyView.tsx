import * as React from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { Breadcrumb, Skeleton, Spin, Tabs, Typography } from 'antd';
import Layout from '../../components/layout/Layout';
import Error from '../../components/error/Error';
import UnitsTab from '../../components/page-company-view/UnitsTab';
import UsersTab from '../../components/page-company-view/UsersTab';
import AssetsTab from '../../components/page-company-view/AssetsTab';
import CoverTab from '../../components/page-company-view/CoverTab';
import { Company } from '../../types/api';
import useGetData from '../../hooks/useGetData';

type PageCompanyRouteParams = {
  companyId: string;
  companyTab: string;
};

export default function PageCompanyView() {
  const { companyId, companyTab } = useParams<PageCompanyRouteParams>();
  const { data, loading, error, refetch } = useGetData<Company>(
    `companies/${companyId}`
  );
  const history = useHistory();

  function handleTabChange(key: string) {
    const targetTab = tabs.find((tab) => tab.key === key)?.name || 'ativos';
    history.push(`/empresas/${companyId}/${targetTab}`);
  }

  const activeTab =
    tabs.find((tab) => tab.name === companyTab)?.key || 'assets';

  React.useEffect(() => {
    if (data?.name) {
      document.title = `${data?.name} — Tractian`;
    }
  }, [data]);

  return (
    <Layout>
      <Skeleton paragraph={false} loading={loading}>
        <Breadcrumb separator=">" className="breadcrumb">
          <Breadcrumb.Item>
            <Link to="/empresas">Empresas</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{data?.name}</Breadcrumb.Item>
        </Breadcrumb>
      </Skeleton>
      <Skeleton paragraph={false} loading={loading}>
        <div className="title-container">
          <Typography.Title>{data?.name}</Typography.Title>
          <Link to={`/empresas/${companyId}/editar`}>Editar Empresa</Link>
        </div>
      </Skeleton>
      {loading ? (
        <div className="spin-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Error refetch={refetch} />
      ) : data ? (
        <Tabs
          onChange={handleTabChange}
          defaultActiveKey="assets"
          activeKey={activeTab}
        >
          <Tabs.TabPane tab="Cover" key="cover">
            <CoverTab companyId={companyId} />
          </Tabs.TabPane>
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
      ) : null}
    </Layout>
  );
}

const tabs = [
  { key: 'cover', name: 'cover' },
  { key: 'units', name: 'unidades' },
  { key: 'users', name: 'usuarios' },
  { key: 'assets', name: 'ativos' },
];
