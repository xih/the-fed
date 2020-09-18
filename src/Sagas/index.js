import { all } from "redux-saga/effects"
import rootAuthSaga from "./AuthSaga"
import rootStartupSaga from "./StartupSaga"

export default function* root() {
  yield all([rootAuthSaga(), rootStartupSaga()])
}
