import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route, useRouterHistory } from 'react-router';
import { IndexPage, UploadPage, BuildsPage, SettingsPage, LoginPage } from './pages';
import Build from './components/Build';
import { createHashHistory } from 'history';

// useRouterHistory creates a composable higher-order function
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

ReactDOM.render(
  <Router history={appHistory}>
    <Route path='/'             component={IndexPage}/>
    <Route path='/upload'       component={UploadPage}/>
    <Route path='/builds'       component={BuildsPage}>
      <Route path='/builds/:id' component={Build}/>
    </Route>
    <Route path='/settings'     component={SettingsPage}/>
    <Route path='/login'        component={LoginPage}/>
  </Router>,
  document.getElementById('app-container')
);

document.body.parentNode.classList.remove('no-js')
