import { put, call, all, take, takeLatest } from "redux-saga/effects"
import { getErrorMsg } from "../utils"
import {
  StartupAsyncActions,
  StartupAsyncTypes,
} from "../Stores/Startup/Actions"

export function* startup() {
  yield put(StartupAsyncActions.startupLoading())

  try {
    yield put(StartupAsyncActions.startupSuccess())
  } catch (e) {
    const errorMsg = getErrorMsg(e)
    yield put(StartupAsyncActions.startupFailure({ message: errorMsg }))
  }
}

export default function* rootStartupSaga() {
  yield all([takeLatest(StartupAsyncTypes.STARTUP, startup)])
}
