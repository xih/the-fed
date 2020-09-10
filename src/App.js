import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import './App.css';
import Homepage from './Homepage'
import { Route, Switch } from 'react-router'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import PlaidLinkPage from './PlaidLinkPage';
import { StartupAsyncActions, StartupAsyncTypes } from './Stores/Startup/Actions';



function App({ startup }) {
  useEffect(() => {
    startup()
  }, [])



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
const mapStateToProps = (state) => ({

})
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupAsyncActions.startup())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
