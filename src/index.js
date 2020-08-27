import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'
import configureStore, { history } from './Stores/createStore'
import App from './App';
import LoginPage from './LoginPage'

const store = configureStore()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/" render={App} />
          <Route path='/login' render={LoginPage} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
