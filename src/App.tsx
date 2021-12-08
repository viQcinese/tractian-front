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
