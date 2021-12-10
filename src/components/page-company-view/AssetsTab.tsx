import * as React from 'react';
import { Progress, Table } from 'antd';
import { Link } from 'react-router-dom';
import useGetData from '../../hooks/useGetData';
import { Asset } from '../../types/api';
import { maskHours, maskPower, maskTemperature } from '../../utils/masks';

type AssetsTabProps = {
  companyId: string;
};

export default function AssetsTab(props: AssetsTabProps) {
  const { companyId } = props;
  const { data, loading } = useGetData<Asset[]>(
    `companies/${companyId}/assets`
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={false}
    />
  );
}

const columns = [
  {
    title: 'Nome',
    dataIndex: 'name',
    render: (text: string, asset: Asset) => (
      <Link to={`/empresas/${asset.companyId}/ativos/${asset.id}`}>
        {text || '- -'}
      </Link>
    ),
  },
  {
    title: 'Modelo',
    dataIndex: 'model',
    render: (value: string) => value ?? '- -',
  },
  {
    title: 'Temp. Máxima',
    dataIndex: ['specifications', 'maxTemp'],
    render: (value: number) => (value ? maskTemperature(value) : '- -'),
  },
  {
    title: 'Potência',
    dataIndex: ['specifications', 'power'],
    render: (value: number) => (value ? maskPower(value) : '- -'),
  },
  {
    title: 'RPM',
    dataIndex: ['specifications', 'rpm'],
    render: (value: number) => value ?? '- -',
  },
  {
    title: 'Tempo de Atividade',
    dataIndex: ['metrics', 'totalUptime'],
    render: (value: number) => (value ? maskHours(value) : '- -'),
  },
  {
    title: 'Total de Ciclos',
    dataIndex: ['metrics', 'totalCollectsUptime'],
    render: (value: number) => value || '- -',
  },
  {
    title: 'Último Ciclo',
    dataIndex: ['metrics', 'lastUptimeAt'],
    render: (value: string) =>
      value ? new Date(value).toLocaleString() : '- -',
  },
  {
    title: 'Desempenho',
    dataIndex: 'healthscore',
    render: (__: string, asset: Asset) => (
      <Progress
        type="circle"
        width={50}
        percent={Number(asset.healthscore.toFixed(1))}
        strokeColor={
          asset.healthscore > 75
            ? 'green'
            : asset.healthscore > 60
            ? 'orange'
            : 'red'
        }
      />
    ),
  },
  {
    title: 'Unidade',
    dataIndex: 'unitId',
    render: (value: string) => value || '- -',
  },
  {
    title: 'Id',
    dataIndex: 'id',
    render: (value: string) => value || '- -',
  },
];
