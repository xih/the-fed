import { all } from "redux-saga/effects"
import rootAuthSaga from "./AuthSaga"
import rootStartupSaga from "./StartupSaga"
import rootPlaidSaga from './PlaidSaga'

export default function* root() {
  yield all([
    /**
     * @see https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
     */
    // Run the startup saga when the application starts
    rootAuthSaga(),
    rootStartupSaga(),
    rootPlaidSaga(),
  ])
}
