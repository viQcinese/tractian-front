import * as React from 'react';
import { RouteComponentProps, useHistory, Link } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Typography,
  message,
  FormInstance,
  Skeleton,
  Modal,
  Breadcrumb,
} from 'antd';
import Layout from '../../components/layout/Layout';
import Error from '../../components/error/Error';
import { Company } from '../../types/api';
import usePostData from '../../hooks/usePostData';
import useGetData from '../../hooks/useGetData';
import useDisclosure from '../../hooks/useDisclosure';
import useDeleteData from '../../hooks/useDeleteData';
import usePutData from '../../hooks/usePutData';

type CompanyRegistrationRouteParams = {
  companyId?: string;
};

type PageCompanyRegistrationProps = RouteComponentProps<
  CompanyRegistrationRouteParams,
  Record<string, 'unknown'>,
  unknown
>;

type CompanyRegistrationData = Omit<Company, 'id'>;

export default function PageCompanyRegistration(
  props: PageCompanyRegistrationProps
) {
  const { match } = props;
  const { companyId } = match.params;
  const isEditPage = !!companyId;
  const history = useHistory();

  const formRef = React.useRef<FormInstance<CompanyRegistrationData>>(null);
  const [form] = Form.useForm(
    formRef.current as FormInstance<CompanyRegistrationData>
  );

  const {
    loading: fetchLoading,
    data,
    error,
    refetch,
  } = useGetData<Company>(`companies/${companyId}`, { shouldGet: isEditPage });

  const [registerCompany, { loading: registrationLoading }] =
    usePostData<CompanyRegistrationData>('companies', {
      onCompleted: ({ status }) => {
        if (status === 201) {
          history.push('/empresas');
          message.success('Nova empresa cadastrada com sucesso!');
        }
      },
    });

  const [updateCompany, { loading: updateLoading }] =
    usePutData<CompanyRegistrationData>(`companies/${companyId}`, {
      onCompleted: ({ status }) => {
        if (status === 200) {
          history.push(`/empresas/${companyId}`);
          message.success('Empresa editada com sucesso!');
        }
      },
    });

  const [deleteCompany, { loading: deleteLoading }] = useDeleteData(
    `companies/${companyId}`,
    {
      onCompleted: ({ status }) => {
        if (status === 200) {
          onClose();
          history.push('/empresas');
          message.info('Empresa deletada com sucesso!');
        }
      },
    }
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    if (data?.name) {
      form.setFields([{ name: 'name', value: data?.name }]);
    }
  }, [data]);

  function submitForm(data: CompanyRegistrationData) {
    if (isEditPage) {
      updateCompany(data);
    } else {
      registerCompany(data);
    }
  }

  return (
    <Layout isForm>
      <Modal
        title="Atenção!"
        visible={isOpen}
        onOk={deleteCompany}
        okText="Deletar Empresa"
        okButtonProps={{ danger: true, loading: deleteLoading }}
        cancelText="Voltar"
        onCancel={onClose}
      >
        Atenção, você irá deletar uma empresa do sistema. Esta ação é
        irreversível e os dados apagados não poderão mais ser recuperados.
        Deseja continuar?
      </Modal>
      <Breadcrumb separator=">" className="breadcrumb">
        <Breadcrumb.Item href="/empresas">
          <Link to="/empresas">Empresas</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {isEditPage ? 'Editar Empresa' : 'Cadastrar Empresa'}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Typography.Title>
        {isEditPage ? 'Editar Empresa' : 'Cadastrar Empresa'}
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ fontSize: '16px' }}>
        {isEditPage
          ? 'Para editar uma empresa já acadastrada, altere os dados abaixo conforme as suas necessidades'
          : 'Para cadastrar uma nova empresa, preencha os dados abaixo'}
      </Typography.Paragraph>
      {error ? (
        <Error refetch={refetch} />
      ) : (
        <Form
          ref={formRef}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: '100%', marginTop: '4rem' }}
          onFinish={submitForm}
        >
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={fetchLoading}
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
          </Skeleton>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={registrationLoading || updateLoading}
              disabled={fetchLoading}
            >
              {isEditPage ? 'Editar Empresa' : 'Cadastrar Empresa'}
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="ghost" onClick={() => history.goBack()}>
              Voltar
            </Button>
          </Form.Item>
          {isEditPage ? (
            <Form.Item wrapperCol={{ offset: 20, span: 4 }}>
              <Button
                danger
                onClick={onOpen}
                style={{ marginLeft: 'auto' }}
                block
              >
                Deletar
              </Button>
            </Form.Item>
          ) : null}
        </Form>
      )}
    </Layout>
  );
}
