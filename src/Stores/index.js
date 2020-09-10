import { combineReducers } from 'redux'
import rootSaga from '../Sagas'
import configureStore from './createStore'
import { connectRouter } from 'connected-react-router'
// import { reducer as UserReducer } from './User/Reducers';
import { createBrowserHistory } from 'history'
import { reducer as UserReducer } from './User/Reducers'

export const history = createBrowserHistory()

export default () => {
  const allReducers = (history) => combineReducers({
    router: connectRouter(history),
    user: UserReducer,
  })

  const rootReducer = (state, action) => {
    if (action.type === 'STARTUP') {
      console.log('what is the state', state)
      Object.keys(state).forEach((key) => {
        state[key].errors = {}
        state[key].isLoading = {}
      })
    }
    return allReducers(history)(state, action)
  }

  return configureStore(rootReducer, rootSaga)
}