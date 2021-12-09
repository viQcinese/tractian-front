import * as React from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import Layout from '../../components/layout/Layout';
import usePostData from '../../hooks/usePostData';
import { Company } from '../../types/api';
import { useHistory } from 'react-router';

const { Title, Paragraph } = Typography;

type CompanyRegistrationData = Omit<Company, 'id'>;

export default function PageCompanyRegistration() {
  const [registerCompany, { loading }] = usePostData<CompanyRegistrationData>(
    'companies',
    {
      onCompleted: ({ status }) => {
        if (status === 201) {
          history.push('/empresas');
          message.success('Nova empresa cadastrada com sucesso!');
        }
      },
    }
  );
  const history = useHistory();

  function submitForm(data: CompanyRegistrationData) {
    registerCompany(data);
  }

  return (
    <Layout isForm>
      <Title>Cadastrar Empresa</Title>
      <Paragraph type="secondary" style={{ fontSize: '16px' }}>
        Para cadastrar uma nova empresa, preencha os dados abaixo
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
            { required: true, message: 'O nome da empresa é obrigatório' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cadastrar Empresa
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
