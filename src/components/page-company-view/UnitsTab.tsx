import * as React from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import useRemoteData from '../../hooks/useRemoteData';
import { Unit } from '../../types/api';

type UnitsTabProps = {
  companyId: string;
};

export default function UnitsTab(props: UnitsTabProps) {
  const { companyId } = props;
  const { data, loading } = useRemoteData<Unit[]>(
    `companies/${companyId}/units`
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
    key: 'name',
    render: (text: string, unit: Unit) => (
      <Link to={`/empresas/${unit.companyId}/unidades/${unit.id}/editar`}>
        {text || '- -'}
      </Link>
    ),
  },
  {
    title: 'Id',
    dataIndex: 'id',
    render: (value: string) => value ?? '- -',
  },
];
