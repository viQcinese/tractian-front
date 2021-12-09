import * as React from 'react';
import { Button, Form, Input, Select, Typography, message, Empty } from 'antd';
import Layout from '../../components/layout/Layout';
import usePostData from '../../hooks/usePostData';
import { Company, Unit, User } from '../../types/api';
import { useHistory } from 'react-router';
import useRemoteData from '../../hooks/useRemoteData';

const { Title, Paragraph } = Typography;

type UserRegistrationData = Omit<User, 'id'>;

export default function PageUserRegistration() {
  const [selectedCompany, setSelectedCompany] = React.useState<number>();
  const [registerUser, { loading: submitLoading }] =
    usePostData<UserRegistrationData>('users', {
      onCompleted: ({ status }, { companyId }) => {
        if (status === 201) {
          history.push(`empresas/${companyId}/usuarios`);
          message.success('Novo usuário cadastrado com sucesso!');
        }
      },
    });

  const { data: companiesData, loading: companiesLoading } =
    useRemoteData<Company[]>(`companies`);
  const { data: unitsData, loading: unitsLoading } = useRemoteData<Unit[]>(
    `companies/${selectedCompany}/units`
  );

  const history = useHistory();

  function submitForm(data: UserRegistrationData) {
    registerUser(data);
  }

  return (
    <Layout isForm>
      <Title>Cadastrar Unidade</Title>
      <Paragraph type="secondary" style={{ fontSize: '16px' }}>
        Para cadastrar uma nova unidade, preencha os dados abaixo
      </Paragraph>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ width: '100%', marginTop: '4rem' }}
        onFinish={submitForm}
      >
        <Form.Item
          label="Nome"
          name="name"
          rules={[
            { required: true, message: 'O nome da unidade é obrigatório' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'O email é obrigatório' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Empresa"
          name="companyId"
          rules={[{ required: true, message: 'A empresa é obrigatória' }]}
        >
          <Select
            loading={companiesLoading}
            notFoundContent={<Empty />}
            onChange={(value) => setSelectedCompany(value as number)}
          >
            {companiesData?.map((company) => (
              <Select.Option key={company.id} value={company.id}>
                {company.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Unidade"
          name="unitId"
          rules={[{ required: true, message: 'A unidade é obrigatória' }]}
        >
          <Select loading={unitsLoading} notFoundContent={<Empty />}>
            {unitsData?.map((unit) => (
              <Select.Option key={unit.id} value={unit.id}>
                {unit.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitLoading || companiesLoading || unitsLoading}
          >
            Cadastrar Usuário
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="ghost" onClick={() => history.goBack()}>
            Voltar
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
}
