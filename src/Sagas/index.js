import { all } from 'redux-saga/effects'
import rootAuthSaga from './AuthSaga';

export default function* root() {
  yield all([
    rootAuthSaga(),
  ])
}