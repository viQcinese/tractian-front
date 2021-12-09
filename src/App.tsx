import React from 'react';
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect,
} from 'react-router-dom';
import PageCompanyList from './pages/company-list/CompanyList';
import PageCompanyView from './pages/company-view/CompanyView';
import PageNotFound from './pages/not-found/NotFound';
import PageCompanyRegistration from './pages/company-registration/CompanyRegistration';
import PageUnitRegistration from './pages/unit-registration/UnitRegistration';
import PageUserRegistration from './pages/user-registration/UserRegistration';
import PageAssetRegistration from './pages/asset-registration/AssetRegistration';
import 'antd/dist/antd.css';
import './styles.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/empresas" />
        </Route>
        <Route exact path="/empresas" component={PageCompanyList} />
        <Route
          exact
          path="/cadastrar-empresa"
          component={PageCompanyRegistration}
        />
        <Route
          exact
          path="/cadastrar-unidade"
          component={PageUnitRegistration}
        />
        <Route
          exact
          path="/cadastrar-usuario"
          component={PageUserRegistration}
        />
        <Route
          exact
          path="/cadastrar-ativo"
          component={PageAssetRegistration}
        />
        <Route
          path="/empresas/:companyId"
          render={({ match }) => (
            <Switch>
              <Route exact path={match.path}>
                <Redirect to={`${match.url}/ativos`} />
              </Route>
              <Route
                path={`${match.path}/:companyTab`}
                component={PageCompanyView}
              />
            </Switch>
          )}
        />
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  );
}

export default App;
