import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route, useRouterHistory } from 'react-router';
import { IndexPage, UploadPage, JobsPage, SettingsPage, LoginPage } from './pages';
import Job from './components/Job';
import { createHashHistory } from 'history';

import css from './styl/app.styl'; // Just the CSS

// useRouterHistory creates a composable higher-order function
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

ReactDOM.render(
  <Router history={appHistory}>
    <Route path='/'             component={IndexPage}/>
    <Route path='/upload'       component={UploadPage}/>
    <Route path='/jobs'         component={JobsPage}>
      <Route path='/jobs/:id'   component={Job}/>
    </Route>
    <Route path='/settings'     component={SettingsPage}/>
    <Route path='/login'        component={LoginPage}/>
  </Router>,
  document.getElementById('app-container')
);

document.body.parentNode.classList.remove('no-js')
