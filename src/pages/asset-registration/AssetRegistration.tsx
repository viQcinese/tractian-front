import * as React from 'react';
import moment from 'moment';
import {
  Button,
  Form,
  Input,
  Select,
  Typography,
  message,
  Empty,
  InputNumber,
  DatePicker,
  Upload,
  Divider,
  FormInstance,
  Skeleton,
  Modal,
  Breadcrumb,
} from 'antd';
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import Layout from '../../components/layout/Layout';
import { Asset, Company, Unit } from '../../types/api';
import { UploadFile } from 'antd/lib/upload/interface';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import useGetData from '../../hooks/useGetData';
import usePostData from '../../hooks/usePostData';
import useDisclosure from '../../hooks/useDisclosure';
import usePutData from '../../hooks/usePutData';
import useDeleteData from '../../hooks/useDeleteData';
import { API_URL } from '../../utils/constants';
import Error from '../../components/error/Error';

type AssetRegistrationRouteParams = {
  companyId?: string;
  assetId?: string;
};

type PageAssetRegistrationProps = RouteComponentProps<
  AssetRegistrationRouteParams,
  Record<string, 'unknown'>,
  unknown
>;

type AntFileUpload = {
  file: UploadFile;
  fileList: FileList;
};

type AssetRegistrationData = Omit<Asset, 'id' | 'image'> & {
  image?: AntFileUpload;
};

type AssetRegistrationNormalizedData = Omit<Asset, 'id' | 'image'> & {
  image?: FileList;
};

export default function PageAssetRegistration(
  props: PageAssetRegistrationProps
) {
  const { match } = props;
  const { assetId, companyId } = match.params;
  const isEditPage = !!assetId && !!companyId;
  const history = useHistory();

  const formRef = React.useRef<FormInstance<AssetRegistrationData>>(null);
  const [form] = Form.useForm(
    formRef.current as FormInstance<AssetRegistrationData>
  );

  const {
    loading: assetLoading,
    data: assetData,
    error,
    refetch,
  } = useGetData<Asset>(`assets/${assetId}`, { shouldGet: isEditPage });

  const [selectedCompany, setSelectedCompany] = React.useState<number>();
  const [registerAsset, { loading: registrationLoading }] =
    usePostData<AssetRegistrationNormalizedData>('assets', {
      onCompleted: ({ status, data }) => {
        if (status === 201) {
          history.push(`/empresas/${data.companyId}/ativos`);
          message.success('Novo ativo cadastrado com sucesso!');
        }
      },
    });

  const [updateAsset, { loading: updateLoading }] =
    usePutData<AssetRegistrationNormalizedData>(`assets/${assetId}`, {
      onCompleted: ({ status, data }) => {
        if (status === 200) {
          history.push(`/empresas/${data.companyId}/ativos`);
          message.success('Ativo editado com sucesso!');
        }
      },
    });

  const [deleteAsset, { loading: deleteLoading }] = useDeleteData(
    `assets/${assetId}`,
    {
      onCompleted: ({ status }) => {
        if (status === 200) {
          history.push(`/empresas/${companyId}/ativos`);
          message.info('Ativo deletado com sucesso!');
        }
      },
    }
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: companiesData, loading: companiesLoading } =
    useGetData<Company[]>(`companies`);
  const { data: unitsData, loading: unitsLoading } = useGetData<Unit[]>(
    `companies/${selectedCompany}/units`
  );

  React.useEffect(() => {
    setSelectedCompany(assetData?.companyId);
    form.setFields([
      { name: 'name', value: assetData?.name },
      { name: 'companyId', value: assetData?.companyId },
      { name: 'unitId', value: assetData?.unitId },
      { name: 'model', value: assetData?.model },
      { name: 'status', value: assetData?.status },
      { name: 'healthscore', value: assetData?.healthscore },
      { name: 'maxTemp', value: assetData?.specifications.maxTemp },
      { name: 'power', value: assetData?.specifications.power },
      { name: 'rpm', value: assetData?.specifications.rpm },
      { name: 'totalUptime', value: assetData?.metrics.totalUptime },
      {
        name: 'totalCollectsUptime',
        value: assetData?.metrics.totalCollectsUptime,
      },
      {
        name: 'lastUptimeAt',
        value: moment(assetData?.metrics.lastUptimeAt),
      },
      { name: 'sensors', value: assetData?.sensors },
    ]);
  }, [assetData]);

  function submitForm(data: AssetRegistrationData) {
    const normalizedData = { ...data, image: data?.image?.fileList };

    if (isEditPage) {
      updateAsset(normalizedData);
    } else {
      registerAsset(normalizedData);
    }
  }

  React.useEffect(() => {
    document.title = isEditPage
      ? 'Editar Ativo — Tractian'
      : 'Cadastrar Ativo — Tractian';
  }, []);

  return (
    <Layout isForm>
      <Modal
        title="Atenção!"
        visible={isOpen}
        onOk={deleteAsset}
        okText="Deletar Ativo"
        okButtonProps={{ danger: true, loading: deleteLoading }}
        cancelText="Voltar"
        onCancel={onClose}
      >
        Atenção, você irá deletar um ativo do sistema. Esta ação é irreversível
        e os dados apagados não poderão mais ser recuperados. Deseja continuar?
      </Modal>
      <Breadcrumb separator=">" className="breadcrumb">
        <Breadcrumb.Item href="/empresas">
          <Link to="/empresas">Empresas</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {isEditPage ? 'Editar Ativo' : 'Cadastrar Ativo'}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Typography.Title>
        {isEditPage ? 'Editar Ativo' : 'Cadastrar Ativo'}
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ fontSize: '16px' }}>
        {isEditPage
          ? 'Para editar um ativo já cadastrado, altere os dados abaixo conforme as suas necessidades'
          : 'Para cadastrar um novo ativo, preencha os dados abaixo'}
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
            loading={assetLoading}
          >
            <Form.Item
              label="Nome"
              name="name"
              rules={[
                { required: true, message: 'O nome do ativo é obrigatório' },
              ]}
            >
              <Input />
            </Form.Item>
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={assetLoading}
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
                {companiesData?.map((company) => (
                  <Select.Option key={company.id} value={company.id}>
                    {company.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={assetLoading}
          >
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
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={assetLoading}
          >
            <Form.Item label="Modelo" name="model">
              <Input />
            </Form.Item>
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={assetLoading}
          >
            <Form.Item label="Status" name="status">
              <Select
                notFoundContent={<Empty />}
                onChange={(value) => setSelectedCompany(value as number)}
              >
                {statusArray.map((status) => (
                  <Select.Option key={status.key} value={status.key}>
                    {status.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={assetLoading}
          >
            <Form.Item label="Saúde (%)" name="healthscore">
              <InputNumber max={100} min={0} />
            </Form.Item>
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={assetLoading}
          >
            <Form.Item label="Imagem">
              <Form.Item name="image" valuePropName="image" noStyle>
                <Upload
                  name="image"
                  action={API_URL}
                  beforeUpload={() => false}
                  accept=".jpg,.jpeg,.png"
                >
                  <Button icon={<UploadOutlined />}>Fazer Upload</Button>
                </Upload>
              </Form.Item>
            </Form.Item>
          </Skeleton>
          <Divider />
          <Form.List name="sensors" initialValue={['']}>
            {(fields, { add, remove }) => (
              <React.Fragment>
                {fields.map((field, index) => (
                  <Form.Item
                    {...field}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 12, offset: index === 0 ? 0 : 8 }}
                    label={index === 0 ? 'Sensores' : ''}
                    key={field.key}
                  >
                    <Form.Item {...field} noStyle>
                      <div className="dynamic-input">
                        <Input />
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </div>
                    </Form.Item>
                  </Form.Item>
                ))}
                <Form.Item wrapperCol={{ offset: 8 }}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                  >
                    Add field
                  </Button>
                </Form.Item>
              </React.Fragment>
            )}
          </Form.List>
          <Divider />
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={assetLoading}
          >
            <Form.Item label="Temp. Máxima (°C)" name="maxTemp">
              <InputNumber min={-273} />
            </Form.Item>
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={assetLoading}
          >
            <Form.Item label="Potência (kWh)" name="power">
              <InputNumber min={0} />
            </Form.Item>
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={assetLoading}
          >
            <Form.Item label="RPM" name="rpm">
              <InputNumber min={0} />
            </Form.Item>
          </Skeleton>
          <Divider />
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={assetLoading}
          >
            <Form.Item
              label="Total de Coletas Uptime"
              name="totalCollectsUptime"
            >
              <InputNumber min={0} />
            </Form.Item>
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={assetLoading}
          >
            <Form.Item label="Total de Horas de Coleta" name="totalUptime">
              <InputNumber min={0} />
            </Form.Item>
          </Skeleton>
          <Skeleton
            paragraph={{ rows: 0, width: '100%' }}
            loading={assetLoading}
          >
            <Form.Item label="Data da Última Coleta" name="lastUptimeAt">
              <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime />
            </Form.Item>
          </Skeleton>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={registrationLoading || updateLoading}
              disabled={assetLoading || companiesLoading || unitsLoading}
            >
              {isEditPage ? 'Editar Ativo' : 'Cadastrar Ativo'}
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

const statusArray = [
  { name: 'Em Alerta', key: 'inAlert' },
  { name: 'Em Descanso', key: 'inDowntime' },
  { name: 'Em Funcionamento', key: 'inOperation' },
];
