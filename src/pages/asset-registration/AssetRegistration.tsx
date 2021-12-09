import * as React from 'react';
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
} from 'antd';
import Layout from '../../components/layout/Layout';
import usePostData from '../../hooks/usePostData';
import { Asset, Company, Unit } from '../../types/api';
import { useHistory } from 'react-router';
import useRemoteData from '../../hooks/useRemoteData';
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { API_URL } from '../../utils/constants';
import { UploadFile } from 'antd/lib/upload/interface';
const { Title, Paragraph } = Typography;
import './AssetRegistration.css';

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

export default function PageAssetRegistration() {
  const [selectedCompany, setSelectedCompany] = React.useState<number>();
  const [registerAsset, { loading: submitLoading }] =
    usePostData<AssetRegistrationNormalizedData>('assets', {
      onCompleted: ({ status }, { companyId }) => {
        if (status === 201) {
          history.push(`empresas/${companyId}/ativos`);
          message.success('Novo ativo cadastrado com sucesso!');
        }
      },
    });

  const { data: companiesData, loading: companiesLoading } =
    useRemoteData<Company[]>(`companies`);
  const { data: unitsData, loading: unitsLoading } = useRemoteData<Unit[]>(
    `companies/${selectedCompany}/units`
  );

  const history = useHistory();

  function submitForm(data: AssetRegistrationData) {
    const normalizedData = { ...data, image: data?.image?.fileList };
    console.log(data);
    registerAsset(normalizedData);
  }

  return (
    <Layout isForm>
      <Title>Cadastrar Ativo</Title>
      <Paragraph type="secondary" style={{ fontSize: '16px' }}>
        Para cadastrar um novo ativo, preencha os dados abaixo
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
          rules={[{ required: true, message: 'O nome do ativo é obrigatório' }]}
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
        <Form.Item label="Modelo" name="model">
          <Input />
        </Form.Item>
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
        <Form.Item label="Saúde (%)" name="healthscore">
          <InputNumber max={100} min={0} />
        </Form.Item>
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
        <Divider />
        <Form.List name="sensors" initialValue={['']}>
          {(fields, { add, remove }) => (
            <>
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
            </>
          )}
        </Form.List>

        <Divider />
        <Form.Item label="Temp. Máxima (°C)" name="maxTemp">
          <InputNumber min={-273} />
        </Form.Item>
        <Form.Item label="Potência (kWh)" name="power">
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="RPM" name="rpm">
          <InputNumber min={0} />
        </Form.Item>
        <Divider />
        <Form.Item label="Total de Coletas Uptime" name="totalCollectsUptime">
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Total de Horas de Coleta" name="totalUptime">
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Data da Última Coleta" name="lastUptimeAt">
          <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime />
        </Form.Item>
        <Divider />
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitLoading || companiesLoading || unitsLoading}
          >
            Cadastrar Ativo
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

const statusArray = [
  { name: 'Em Alerta', key: 'inAlert' },
  { name: 'Em Descanso', key: 'inDowntime' },
  { name: 'Em Funcionamento', key: 'inOperation' },
];
