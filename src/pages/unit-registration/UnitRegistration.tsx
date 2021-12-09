import * as React from 'react';
import { Button, Form, Input, Select, Typography, message, Empty } from 'antd';
import Layout from '../../components/layout/Layout';
import usePostData from '../../hooks/usePostData';
import { Company, Unit } from '../../types/api';
import { useHistory } from 'react-router';
import useRemoteData from '../../hooks/useRemoteData';

const { Title, Paragraph } = Typography;

type UnitRegistrationData = Omit<Unit, 'id'>;

export default function PageUnitRegistration() {
  const [registerUnit, { loading: submitLoading }] =
    usePostData<UnitRegistrationData>('units', {
      onCompleted: ({ status }, { companyId }) => {
        if (status === 201) {
          history.push(`empresas/${companyId}/unidades`);
          message.success('Nova unidade cadastrada com sucesso!');
        }
      },
    });

  const { data, loading } = useRemoteData<Company[]>(`companies`);
  const history = useHistory();

  function submitForm(data: UnitRegistrationData) {
    registerUnit(data);
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
          label="Empresa"
          name="companyId"
          rules={[{ required: true, message: 'A empresa é obrigatória' }]}
        >
          <Select loading={loading} notFoundContent={<Empty />}>
            {data?.map((company) => (
              <Select.Option key={company.id} value={company.id}>
                {company.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitLoading || loading}
          >
            Cadastrar Unidade
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
