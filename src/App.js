import React, { useEffect } from "react"
import { connect } from "react-redux"
import "./App.css"
import { Route, Switch } from "react-router"
import Homepage from "./Routes/Homepage"
import LoginPage from "./Routes/LoginPage"
import SignupPage from "./Routes/SignupPage"
import PlaidLinkPage from "./Routes/PlaidLinkPage"
import AccountsPage from './Routes/AccountsPage'
import { StartupAsyncActions } from "./Stores/Startup/Actions"
import WrappedSidebar from './components/Sidebar/WrappedSidebar'

function App({ startup }) {
  useEffect(() => {
    startup()
  }, [startup])

  return (
    <>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/plaidlink" component={PlaidLinkPage} />
        <Route path="/accounts" component={WrappedSidebar(AccountsPage)} />
      </Switch>
    </>
  )
}

const mapStateToProps = null
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupAsyncActions.startup()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
