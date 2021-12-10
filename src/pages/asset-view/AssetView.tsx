import * as React from 'react';
import Layout from '../../components/layout/Layout';
import { Descriptions, Image, Progress, Skeleton, Tag, Typography } from 'antd';
import useGetData from '../../hooks/useGetData';
import { Asset, Company } from '../../types/api';
import { Link, RouteComponentProps } from 'react-router-dom';
import {
  maskDate,
  maskHours,
  maskPower,
  maskTemperature,
} from '../../utils/masks';
const { Title } = Typography;

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
  const { data, loading } = useGetData<Asset>(`assets/${assetId}`);
  const { data: company } = useGetData<Company>(`companies/${data?.companyId}`);
  const { data: unit } = useGetData<Company>(`units/${data?.unitId}`);

  return (
    <Layout>
      <Skeleton paragraph={false} loading={loading}>
        <div className="title-container">
          <Title>{data?.name}</Title>
          <Link to={`${match.url}/editar`}>Editar Ativo</Link>
        </div>
      </Skeleton>
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
              ? maskDate(data.metrics.lastUptimeAt)
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
    </Layout>
  );
}

const statusTags = {
  inAlert: <Tag color="red">Em Alerta</Tag>,
  inDownTime: <Tag color="yellow">Em Descanso</Tag>,
  inOperation: <Tag color="green">Em Operação</Tag>,
};
