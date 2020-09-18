import { combineReducers } from "redux"
import { connectRouter } from "connected-react-router"
import { createBrowserHistory } from "history"
import rootSaga from "../Sagas"
import configureStore from "./createStore"
// import { reducer as UserReducer } from './User/Reducers';
import { reducer as UserReducer } from "./User/Reducers"

export const history = createBrowserHistory()

export default () => {
  const allReducers = (history) =>
    combineReducers({
      router: connectRouter(history),
      user: UserReducer,
    })

  const rootReducer = (state, action) => {
    if (action.type === "STARTUP") {
      Object.keys(state).forEach((key) => {
        state[key].errors = {}
        state[key].isLoading = {}
      })
    }
    return allReducers(history)(state, action)
  }

  return configureStore(rootReducer, rootSaga)
}
