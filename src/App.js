import React, { useEffect } from "react"
import { connect } from "react-redux"
import "./App.css"
import { Route, Switch } from "react-router"
import Homepage from "./Routes/Homepage"
import LoginPage from "./Routes/LoginPage"
import SignupPage from "./Routes/SignupPage"
import PlaidLinkPage from "./Routes/PlaidLinkPage"
import { StartupAsyncActions } from "./Stores/Startup/Actions"

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
      </Switch>
    </>
  )
}
const mapStateToProps = null
const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupAsyncActions.startup()),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
