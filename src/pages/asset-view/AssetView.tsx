import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import {
  Breadcrumb,
  Descriptions,
  Image,
  Progress,
  Skeleton,
  Spin,
  Tag,
  Typography,
} from 'antd';
import Error from '../../components/error/Error';
import { Asset, Company } from '../../types/api';
import useGetData from '../../hooks/useGetData';
import { maskHours, maskPower, maskTemperature } from '../../utils/masks';

type AssetViewRouteParams = {
  assetId: string;
  companyId: string;
};

type PageAssetViewProps = RouteComponentProps<
  AssetViewRouteParams,
  Record<string, 'unknown'>,
  unknown
>;

export default function PageAssetView(props: PageAssetViewProps) {
  const { match } = props;
  const { assetId } = match.params;
  const { data, loading, error, refetch } = useGetData<Asset>(
    `assets/${assetId}`
  );
  const { data: company, loading: companyLoading } = useGetData<Company>(
    `companies/${data?.companyId}`
  );
  const { data: unit } = useGetData<Company>(`units/${data?.unitId}`);

  React.useEffect(() => {
    if (data?.name) {
      document.title = `${data?.name} — Tractian`;
    }
  }, [data]);

  return (
    <Layout>
      <Skeleton paragraph={false} loading={loading || companyLoading}>
        <Breadcrumb separator=">" className="breadcrumb">
          <Breadcrumb.Item href="/empresas">
            <Link to="/empresas">Empresas</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/empresas/${company?.id}`}>{company?.name}</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{data?.name}</Breadcrumb.Item>
        </Breadcrumb>
      </Skeleton>
      <Skeleton paragraph={false} loading={loading}>
        <div className="title-container">
          <Typography.Title>{data?.name}</Typography.Title>
          <Link to={`${match.url}/editar`}>Editar Ativo</Link>
        </div>
      </Skeleton>
      {data ? (
        <div className="asset-description-container">
          <Descriptions
            bordered
            contentStyle={{ background: '#fff' }}
            labelStyle={{ background: '#f9f9f9' }}
          >
            <Descriptions.Item label="Empresa">
              {company?.name || '- -'}
            </Descriptions.Item>
            <Descriptions.Item label="Unidade">
              {unit?.name || '- -'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {data?.status ? statusTags[data.status] : '- -'}
            </Descriptions.Item>
            <Descriptions.Item label="Modelo">
              {data?.model || '- -'}
            </Descriptions.Item>
            <Descriptions.Item label="Sensores ">
              {data?.sensors.map(
                (sensor, index) =>
                  `${sensor}${index !== data?.sensors.length - 1 ? ', ' : ''} `
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Saúde">
              {data?.healthscore ? (
                <Progress
                  type="circle"
                  width={50}
                  percent={Number(data.healthscore.toFixed(1))}
                  strokeColor={
                    data.healthscore > 75
                      ? 'green'
                      : data.healthscore > 60
                      ? 'orange'
                      : 'red'
                  }
                />
              ) : null}
            </Descriptions.Item>
            <Descriptions.Item label="Total de Horas de Coletas">
              {data?.metrics.totalUptime
                ? maskHours(data.metrics.totalUptime)
                : '- -'}
            </Descriptions.Item>
            <Descriptions.Item label="Total de Coletas Uptime">
              {data?.metrics.totalCollectsUptime
                ? data.metrics.totalCollectsUptime
                : '- -'}
            </Descriptions.Item>
            <Descriptions.Item label="Data da Última Coleta">
              {data?.metrics.totalCollectsUptime
                ? new Date(data.metrics.lastUptimeAt).toLocaleString()
                : '- -'}
            </Descriptions.Item>
            <Descriptions.Item label="Temperatura Máxima">
              {data?.specifications.maxTemp
                ? maskTemperature(data.specifications.maxTemp)
                : '- -'}
            </Descriptions.Item>
            <Descriptions.Item label="Potência">
              {data?.specifications.power
                ? maskPower(data.specifications.power)
                : '- -'}
            </Descriptions.Item>
            <Descriptions.Item label="RPM">
              {data?.specifications.rpm || '- -'}
            </Descriptions.Item>
            <Descriptions.Item label="Imagem">
              {data?.image ? (
                <Image src={data?.image} style={{ maxHeight: '300px' }} />
              ) : (
                '- -'
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : loading ? (
        <div className="spin-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Error refetch={refetch} />
      ) : null}
    </Layout>
  );
}

const statusTags = {
  inAlert: <Tag color="red">Em Alerta</Tag>,
  inDowntime: <Tag color="yellow">Em Descanso</Tag>,
  inOperation: <Tag color="green">Em Operação</Tag>,
};
