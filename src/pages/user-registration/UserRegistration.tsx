import * as React from 'react';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import {
  Button,
  Form,
  Input,
  Select,
  Typography,
  message,
  Empty,
  FormInstance,
  Skeleton,
  Modal,
  Breadcrumb,
} from 'antd';
import Layout from '../../components/layout/Layout';
import Error from '../../components/error/Error';
import { Company, Unit, User } from '../../types/api';
import usePostData from '../../hooks/usePostData';
import useGetData from '../../hooks/useGetData';
import useDisclosure from '../../hooks/useDisclosure';
import usePutData from '../../hooks/usePutData';
import useDeleteData from '../../hooks/useDeleteData';

type UserRegistrationRouteParams = {
  companyId?: string;
  userId?: string;
};

type PageUserRegistrationProps = RouteComponentProps<
  UserRegistrationRouteParams,
  Record<string, 'unknown'>,
  unknown
>;

type UserRegistrationData = Omit<User, 'id'>;

export default function PageUserRegistration(props: PageUserRegistrationProps) {
  const { match } = props;
  const { userId, companyId } = match.params;
  const isEditPage = !!userId && !!companyId;
  const history = useHistory();

  const formRef = React.useRef<FormInstance<UserRegistrationData>>(null);
  const [form] = Form.useForm(
    formRef.current as FormInstance<UserRegistrationData>
  );

  const {
    loading: userLoading,
    data: userData,
    error,
    refetch,
  } = useGetData<User>(`users/${userId}`, { shouldGet: isEditPage });

  const [selectedCompany, setSelectedCompany] = React.useState<number>();
  const [registerUser, { loading: registrationLoading }] =
    usePostData<UserRegistrationData>('users', {
      onCompleted: ({ status, data }) => {
        if (status === 201) {
          history.push(`/empresas/${data.companyId}/usuarios`);
          message.success('Novo usuário cadastrado com sucesso!');
        }
      },
    });

  const [updateUser, { loading: updateLoading }] =
    usePutData<UserRegistrationData>(`users/${userId}`, {
      onCompleted: ({ status, data }) => {
        if (status === 200) {
          history.push(`/empresas/${data.companyId}/usuarios`);
          message.success('Usuário editado com sucesso!');
        }
      },
    });

  const [deleteUser, { loading: deleteLoading }] = useDeleteData(
    `users/${userId}`,
    {
      onCompleted: ({ status }) => {
        if (status === 200) {
          history.push(`/empresas/${companyId}/usuarios`);
          message.info('Usuário deletado com sucesso!');
        }
      },
    }
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: companies, loading: companiesLoading } =
    useGetData<Company[]>(`companies`);
  const { data: units, loading: unitsLoading } = useGetData<Unit[]>(
    `companies/${selectedCompany}/units`
  );

  React.useEffect(() => {
    setSelectedCompany(userData?.companyId);
    form.setFields([
      { name: 'name', value: userData?.name },
      { name: 'companyId', value: userData?.companyId },
      { name: 'unitId', value: userData?.unitId },
      { name: 'email', value: userData?.email },
    ]);
  }, [userData]);

  function submitForm(data: UserRegistrationData) {
    if (isEditPage) {
      updateUser(data);
    } else {
      registerUser(data);
    }
  }

  return (
    <Layout isForm>
      <Modal
        title="Atenção!"
        visible={isOpen}
        onOk={deleteUser}
        okText="Deletar Usuário"
        okButtonProps={{ danger: true, loading: deleteLoading }}
        cancelText="Voltar"
        onCancel={onClose}
      >
        Atenção, você irá deletar um usuário do sistema. Esta ação é
        irreversível e os dados apagados não poderão mais ser recuperados.
        Deseja continuar?
      </Modal>
      <Breadcrumb separator=">" className="breadcrumb">
        <Breadcrumb.Item href="/empresas">
          <Link to="/empresas">Empresas</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {isEditPage ? 'Editar Usuário' : 'Cadastrar Usuário'}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Typography.Title>
        {isEditPage ? 'Editar Usuário' : 'Cadastrar Usuário'}
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ fontSize: '16px' }}>
        {isEditPage
          ? 'Para editar um usuário já cadastrado, altere os dados abaixo conforme as suas necessidades'
          : 'Para cadastrar um novo usuário, preencha os dados abaixo'}
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
            loading={userLoading}
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
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={userLoading}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'O email é obrigatório' }]}
            >
              <Input />
            </Form.Item>
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={userLoading}
          >
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
                {companies?.map((company) => (
                  <Select.Option key={company.id} value={company.id}>
                    {company.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={userLoading}
          >
            <Form.Item
              label="Unidade"
              name="unitId"
              rules={[{ required: true, message: 'A unidade é obrigatória' }]}
            >
              <Select loading={unitsLoading} notFoundContent={<Empty />}>
                {units?.map((unit) => (
                  <Select.Option key={unit.id} value={unit.id}>
                    {unit.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Skeleton>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={registrationLoading || updateLoading}
              disabled={userLoading || companiesLoading || unitsLoading}
            >
              {isEditPage ? 'Editar Usuário' : 'Cadastrar Usuário'}
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
