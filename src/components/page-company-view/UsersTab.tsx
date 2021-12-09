import * as React from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import useGetData from '../../hooks/useGetData';
import { User } from '../../types/api';

type UsersTabProps = {
  companyId: string;
};

export default function UsersTab(props: UsersTabProps) {
  const { companyId } = props;
  const { data, loading } = useGetData<User[]>(`companies/${companyId}/users`);

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
    render: (text: string, user: User) => (
      <Link to={`/empresas/${user.companyId}/usuarios/${user.id}/editar`}>
        {text || '- -'}
      </Link>
    ),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    render: (value: string) => value ?? '- -',
  },
  {
    title: 'Unidade',
    dataIndex: 'unitId',
    render: (value: string) => value ?? '- -',
  },
  {
    title: 'Id',
    dataIndex: 'id',
    render: (value: string) => value ?? '- -',
  },
];
