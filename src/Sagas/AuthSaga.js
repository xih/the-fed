import { put, call, all, takeLatest } from 'redux-saga/effects'
import { UserAsyncActions, UserAsyncTypes } from '../Stores/User/Actions'

function* signup() {
  yield put(UserAsyncActions.signupLoading)
  console.log('signup')
}

export default function* rootAuthSaga() {
  yield all([
    // takeLatest(UserAsyncTypes.SIGNUP, signup)
  ])
}