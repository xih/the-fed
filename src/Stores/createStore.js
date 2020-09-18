import { applyMiddleware, compose, createStore } from "redux"
import createSagaMiddleware from "redux-saga"
import { persistReducer, persistStore } from "redux-persist"
import { createBrowserHistory } from "history"
import { routerMiddleware } from "connected-react-router"
import storage from "redux-persist/lib/storage"
import logger from "redux-logger"

const persistConfig = {
  key: "root",
  storage,
  // whitelist: [],
}

export const history = createBrowserHistory()

export default (rootReducer, rootSaga) => {
  const middleware = []
  const enhancers = []

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  middleware.push(routerMiddleware(history))
  // connect sagas to the redux store
  const sagaMiddleware = createSagaMiddleware()
  middleware.push(sagaMiddleware)

  if (process.env.NODE_ENV === "development") {
    middleware.push(logger)
  }
  enhancers.push(applyMiddleware(...middleware))

  // redux persist
  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(...middleware))
  )
  const persistor = persistStore(store)

  // kick off the root saga
  sagaMiddleware.run(rootSaga)

  return { store, persistor }
}
