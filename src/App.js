import React from 'react';
import './App.css';
import Homepage from './Homepage'
import { Route, Switch } from 'react-router'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import PlaidLinkPage from './PlaidLinkPage';

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path='/login' component={LoginPage} />
        <Route path='/signup' component={SignupPage} />
        <Route path='/plaidlink' component={PlaidLinkPage} />
      </Switch>
    </>
  );
}

export default App;
