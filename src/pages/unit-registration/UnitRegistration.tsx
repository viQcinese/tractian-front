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
import { Company, Unit } from '../../types/api';
import usePostData from '../../hooks/usePostData';
import useGetData from '../../hooks/useGetData';
import useDeleteData from '../../hooks/useDeleteData';
import useDisclosure from '../../hooks/useDisclosure';
import usePutData from '../../hooks/usePutData';

type UnitRegistrationRouteParams = {
  companyId?: string;
  unitId?: string;
};

type PageUnitRegistrationProps = RouteComponentProps<
  UnitRegistrationRouteParams,
  Record<string, 'unknown'>,
  unknown
>;

type UnitRegistrationData = Omit<Unit, 'id'>;

export default function PageUnitRegistration(props: PageUnitRegistrationProps) {
  const { match } = props;
  const { unitId, companyId } = match.params;
  const isEditPage = !!unitId && !!companyId;
  const history = useHistory();

  const formRef = React.useRef<FormInstance<UnitRegistrationData>>(null);
  const [form] = Form.useForm(
    formRef.current as FormInstance<UnitRegistrationData>
  );

  const {
    loading: unitLoading,
    data: unitData,
    error,
    refetch,
  } = useGetData<Unit>(`units/${unitId}`, { shouldGet: isEditPage });

  const [registerUnit, { loading: registrationLoading }] =
    usePostData<UnitRegistrationData>('units', {
      onCompleted: ({ status, data }) => {
        if (status === 201) {
          history.push(`/empresas/${data.companyId}/unidades`);
          message.success('Nova unidade cadastrada com sucesso!');
        }
      },
    });

  const [updateUnit, { loading: updateLoading }] =
    usePutData<UnitRegistrationData>(`units/${unitId}`, {
      onCompleted: ({ status, data }) => {
        if (status === 200) {
          history.push(`/empresas/${data.companyId}/unidades`);
          message.success('Unidade alterada com sucesso!');
        }
      },
    });

  const [deleteUnit, { loading: deleteLoading }] = useDeleteData(
    `units/${unitId}`,
    {
      onCompleted: ({ status }) => {
        if (status === 200) {
          onClose();
          history.push(`/empresas/${companyId}/unidades`);
          message.info('Unidade deletada com sucesso!');
        }
      },
    }
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: companies, loading: companiesLoading } =
    useGetData<Company[]>(`companies`);

  React.useEffect(() => {
    form.setFields([
      { name: 'name', value: unitData?.name },
      { name: 'companyId', value: unitData?.companyId },
    ]);
  }, [unitData]);

  function submitForm(data: UnitRegistrationData) {
    if (isEditPage) {
      updateUnit(data);
    } else {
      registerUnit(data);
    }
  }

  React.useEffect(() => {
    document.title = isEditPage
      ? 'Editar Unidade ??? Tractian'
      : 'Cadastrar Unidade ??? Tractian';
  }, []);

  return (
    <Layout isForm>
      <Modal
        title="Aten????o!"
        visible={isOpen}
        onOk={deleteUnit}
        okText="Deletar Unidade"
        okButtonProps={{ danger: true, loading: deleteLoading }}
        cancelText="Voltar"
        onCancel={onClose}
      >
        Aten????o, voc?? ir?? deletar uma unidade do sistema. Esta a????o ??
        irrevers??vel e os dados apagados n??o poder??o mais ser recuperados.
        Deseja continuar?
      </Modal>
      <Breadcrumb separator=">" className="breadcrumb">
        <Breadcrumb.Item href="/empresas">
          <Link to="/empresas">Empresas</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {isEditPage ? 'Editar Unidade' : 'Cadastrar Unidade'}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Typography.Title>
        {isEditPage ? 'Editar Unidade' : 'Cadastrar Unidade'}
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ fontSize: '16px' }}>
        {isEditPage
          ? 'Para editar uma unidade j?? cadastrada, altere os dados abaixo conforme as suas necessidades'
          : 'Para cadastrar uma nova unidade, preencha os dados abaixo'}
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
            loading={unitLoading}
          >
            <Form.Item
              label="Nome"
              name="name"
              rules={[
                { required: true, message: 'O nome da unidade ?? obrigat??rio' },
              ]}
            >
              <Input />
            </Form.Item>
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={unitLoading}
          >
            <Form.Item
              label="Empresa"
              name="companyId"
              rules={[{ required: true, message: 'A empresa ?? obrigat??ria' }]}
            >
              <Select loading={companiesLoading} notFoundContent={<Empty />}>
                {companies?.map((company) => (
                  <Select.Option key={company.id} value={company.id}>
                    {company.name}
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
              disabled={unitLoading || companiesLoading}
            >
              {isEditPage ? 'Editar Unidade' : 'Cadastrar Unidade'}
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
