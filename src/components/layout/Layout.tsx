import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Link } from 'react-router-dom';
import Logo from '../logo/Logo';
import './Layout.css';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout(props: LayoutProps) {
  const { children } = props;
  return (
    <AntLayout>
      <AntLayout.Header className="layout-header">
        <div className="layout-header-container">
          <Link to="/empresas" style={{ display: 'flex' }}>
            <Logo />
          </Link>
        </div>
      </AntLayout.Header>
      <AntLayout.Content className="layout-content">
        {children}
      </AntLayout.Content>
    </AntLayout>
  );
}
