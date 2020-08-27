import React from 'react';
import './App.css';
import Homepage from './Homepage'
import { Route, Switch } from 'react-router'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path='/login' component={LoginPage} />
        <Route path='/signup' component={SignupPage} />
      </Switch>
    </>
  );
}

export default App;
