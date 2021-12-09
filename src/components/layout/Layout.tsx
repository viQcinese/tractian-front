import React from 'react';
import { Card, Layout as AntLayout, Menu, Dropdown } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Logo from '../logo/Logo';
import './Layout.css';

type LayoutProps = {
  children: React.ReactNode;
  isForm?: boolean;
};

export default function Layout(props: LayoutProps) {
  const { children, isForm } = props;
  return (
    <AntLayout>
      <AntLayout.Header className="layout-header">
        <div className="layout-header-container">
          <Link id="tractian-logo" to="/empresas">
            <Logo />
          </Link>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu title="menu">
                <Menu.Item key="company-registration">
                  <Link to="/cadastrar-empresa">Cadastrar Empresa</Link>
                </Menu.Item>
                <Menu.Item key="unit-registration">
                  <Link to="/cadastrar-unidade">Cadastrar Unidade</Link>
                </Menu.Item>
                <Menu.Item key="user-registration">
                  <Link to="/cadastrar-usuario">Cadastrar Usuário</Link>
                </Menu.Item>
                <Menu.Item key="asset-registration">
                  <Link to="cadastrar-ativo">Cadastrar Ativo</Link>
                </Menu.Item>
              </Menu>
            }
          >
            <MenuOutlined style={{ fontSize: '30px', color: 'white' }} />
          </Dropdown>
        </div>
      </AntLayout.Header>

      {isForm ? (
        <AntLayout.Content className="layout-content layout-form">
          <Card>{children}</Card>
        </AntLayout.Content>
      ) : (
        <AntLayout.Content className="layout-content">
          {children}
        </AntLayout.Content>
      )}
    </AntLayout>
  );
}
